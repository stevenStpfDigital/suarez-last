import { useState } from "react";
import {
  Route,
  RouterProvider,
  Routes,
  createBrowserRouter,
} from "react-router-dom";
import { FiltrosSiniestros } from "./pages/siniestros/FiltrosSiniestros";
import PageNotFound from "./layout/PageNotFound";

const router = createBrowserRouter([
  {
    path: "/:field_valid",
    element: <FiltrosSiniestros />,
    errorElement: <PageNotFound />,
  },
  {
    path: "*",
    element: <PageNotFound />,
  },
]);

function App() {
  return <RouterProvider router={router}></RouterProvider>;
}

export default App;
