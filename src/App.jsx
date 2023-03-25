import { routerConfig } from "./router/index.jsx";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

function App() {
  const router = createBrowserRouter(routerConfig);

  return <RouterProvider router={router} />;
}

export default App;
