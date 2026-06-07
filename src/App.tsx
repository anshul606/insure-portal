import { ThemeProvider } from "@mui/material/styles";
import { RouterProvider } from "react-router-dom";
import { router } from "./app/router";
import { MemberProvider } from "./contexts/MemberContext";
import { PolicyProvider } from "./contexts/PolicyContext";
import { ClaimProvider } from "./contexts/ClaimContext";
import { EndorsementProvider } from "./contexts/EndorsementContext";
import { theme } from "./app/theme";
import OfflineAlert from "./components/shared/OfflineAlert";

function App() {
  return (
    <ThemeProvider theme={theme}>
      <MemberProvider>
        <PolicyProvider>
          <ClaimProvider>
            <EndorsementProvider>
              <OfflineAlert />
              <RouterProvider router={router} />
            </EndorsementProvider>
          </ClaimProvider>
        </PolicyProvider>
      </MemberProvider>
    </ThemeProvider>
  );
}

export default App;
