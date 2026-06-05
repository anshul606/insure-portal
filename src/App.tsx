import { ThemeProvider } from "@mui/material/styles";
import { RouterProvider } from "react-router-dom";
import { router } from "./app/router";
import { MemberProvider } from "./contexts/MemberContext";
import { PolicyProvider } from "./contexts/PolicyContext";
import { ClaimProvider } from "./contexts/ClaimContext";
import { theme } from "./app/theme";

function App() {
  return (
    <ThemeProvider theme={theme}>
      <MemberProvider>
        <PolicyProvider>
          <ClaimProvider>
            <RouterProvider router={router} />
          </ClaimProvider>
        </PolicyProvider>
      </MemberProvider>
    </ThemeProvider>
  );
}

export default App;
