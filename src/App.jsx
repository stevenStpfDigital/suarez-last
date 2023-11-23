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
        <Route path="/:field_valid" element={<FiltrosSiniestros />} />
        <Route path="/" element={<FiltrosSiniestros />} />
        {/* </Route> */}
      </Routes>
    </>
  );
}

export default App;
