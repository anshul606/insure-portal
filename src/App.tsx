import { RouterProvider } from "react-router-dom";
import { router } from "./app/router";
import { MemberProvider } from "./contexts/MemberContext";

function App() {
  return (
    <MemberProvider>
      <RouterProvider router={router} />
    </MemberProvider>
  );
}

export default App;
