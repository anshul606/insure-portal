import { ThemeProvider } from "@mui/material/styles";
import { RouterProvider } from "react-router-dom";
import { router } from "./app/router";
import { MemberProvider } from "./contexts/MemberContext";
import { InsuranceProvider } from "./contexts/InsuranceContext";
import { BrandingProvider } from "./contexts/BrandingContext";
import { theme } from "./app/theme";
import OfflineAlert from "./components/shared/OfflineAlert";
import InstallBanner from "./components/InstallBanner";

function App() {
  return (
    <ThemeProvider theme={theme}>
      <BrandingProvider>
        <MemberProvider>
          <InsuranceProvider>
            <OfflineAlert />
            <InstallBanner />
            <RouterProvider router={router} />
          </InsuranceProvider>
        </MemberProvider>
      </BrandingProvider>
    </ThemeProvider>
  );
}

export default App;
