import { useState } from "react";
import reactLogo from "./assets/react.svg";

import { Route, Routes } from "react-router-dom";
import { FiltrosSiniestros } from "./pages/siniestros/FiltrosSiniestros";

function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      <Routes>
        <Route path="/" element={<FiltrosSiniestros />} />
      </Routes>
    </>
  );
}

export default App;
