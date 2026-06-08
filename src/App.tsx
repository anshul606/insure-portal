import { ThemeProvider } from "@mui/material/styles";
import { RouterProvider } from "react-router-dom";
import { router } from "./app/router";
import { MemberProvider } from "./contexts/MemberContext";
import { InsuranceProvider } from "./contexts/InsuranceContext";
import { theme } from "./app/theme";
import OfflineAlert from "./components/shared/OfflineAlert";

function App() {
  return (
    <ThemeProvider theme={theme}>
      <MemberProvider>
        <InsuranceProvider>
          <OfflineAlert />
          <RouterProvider router={router} />
        </InsuranceProvider>
      </MemberProvider>
    </ThemeProvider>
  );
}

export default App;
