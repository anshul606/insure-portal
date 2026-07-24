import { RouterProvider } from "react-router-dom";
import { router } from "./app/router";
import { MemberProvider } from "./contexts/MemberContext";
import { InsuranceProvider } from "./contexts/InsuranceContext";
import { BrandingProvider } from "./contexts/BrandingContext";
import OfflineAlert from "./components/shared/OfflineAlert";
import InstallBanner from "./components/InstallBanner";

function App() {
  return (
    <BrandingProvider>
      <MemberProvider>
        <InsuranceProvider>
          <OfflineAlert />
          <InstallBanner />
          <RouterProvider router={router} />
        </InsuranceProvider>
      </MemberProvider>
    </BrandingProvider>
  );
}

export default App;
