import { useEffect, useState, useCallback } from "react";

interface BeforeInstallPromptEvent extends Event {
    prompt: () => Promise<void>;
    userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

type Platform = "android" | "ios" | "desktop" | "unknown";

function detectPlatform(): Platform {
    const ua = navigator.userAgent || "";
    if (/iPad|iPhone|iPod/.test(ua) || (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1)) {
        return "ios";
    }
    if (/android/i.test(ua)) return "android";
    if (/Win|Mac|Linux/.test(navigator.platform) && navigator.maxTouchPoints <= 1) return "desktop";
    return "unknown";
}

function isStandalone(): boolean {
    return (
        window.matchMedia("(display-mode: standalone)").matches ||
        (window.navigator as unknown as { standalone?: boolean }).standalone === true
    );
}

function recentlyDismissed(): boolean {
    const ts = localStorage.getItem("pwa-install-dismissed");
    if (!ts) return false;
    return Date.now() - Number(ts) < 3 * 24 * 60 * 60 * 1000;
}

export function useInstallPrompt() {
    const [installPrompt, setInstallPrompt] = useState<BeforeInstallPromptEvent | null>(null);
    const [isInstalled, setIsInstalled] = useState(false);
    const [isDismissed, setIsDismissed] = useState(recentlyDismissed);
    const [platform] = useState<Platform>(detectPlatform);

    useEffect(() => {
        if (isStandalone()) {
            setIsInstalled(true);
            return;
        }

        const onBeforeInstall = (e: Event) => {
            e.preventDefault();
            setInstallPrompt(e as BeforeInstallPromptEvent);
        };

        const onInstalled = () => {
            setIsInstalled(true);
            setInstallPrompt(null);
        };

        window.addEventListener("beforeinstallprompt", onBeforeInstall);
        window.addEventListener("appinstalled", onInstalled);

        return () => {
            window.removeEventListener("beforeinstallprompt", onBeforeInstall);
            window.removeEventListener("appinstalled", onInstalled);
        };
    }, []);

    const triggerInstall = useCallback(async () => {
        if (!installPrompt) return;
        await installPrompt.prompt();
        const result = await installPrompt.userChoice;
        if (result.outcome === "accepted") setIsInstalled(true);
        setInstallPrompt(null);
    }, [installPrompt]);

    const dismiss = useCallback(() => {
        setIsDismissed(true);
        localStorage.setItem("pwa-install-dismissed", String(Date.now()));
    }, []);

    const isIOS = platform === "ios";
    const canNativeInstall = !!installPrompt;
    const showBanner = !isInstalled && !isDismissed && (canNativeInstall || isIOS);

    return { showBanner, triggerInstall, dismiss, isInstalled, isIOS, canNativeInstall, platform };
}
