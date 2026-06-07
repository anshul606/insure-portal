import { ThemeProvider } from "@mui/material/styles";
import { RouterProvider } from "react-router-dom";
import { router } from "./app/router";
import { MemberProvider } from "./contexts/MemberContext";
import { PolicyProvider } from "./contexts/PolicyContext";
import { ClaimProvider } from "./contexts/ClaimContext";
import { EndorsementProvider } from "./contexts/EndorsementContext";
import { theme } from "./app/theme";

function App() {
  return (
    <ThemeProvider theme={theme}>
      <MemberProvider>
        <PolicyProvider>
          <ClaimProvider>
            <EndorsementProvider>
              <RouterProvider router={router} />
            </EndorsementProvider>
          </ClaimProvider>
        </PolicyProvider>
      </MemberProvider>
    </ThemeProvider>
  );
}

export default App;
