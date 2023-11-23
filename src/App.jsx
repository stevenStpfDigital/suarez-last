import { useState } from "react";
import reactLogo from "./assets/react.svg";

import { Route, Routes } from "react-router-dom";
import { FiltrosSiniestros } from "./pages/siniestros/FiltrosSiniestros";

function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      <Routes>
        {/* <Route path="/"> */}
        <Route
          path="/siniestros/:field_valid"
          element={<FiltrosSiniestros />}
        />
        <Route path="/siniestros" element={<FiltrosSiniestros />} />
        {/* </Route> */}
      </Routes>
    </>
  );
}

export default App;
