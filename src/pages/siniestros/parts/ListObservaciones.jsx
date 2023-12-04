import React, { useState } from "react";
import AccionButton from "./AccionButton";
import ObsEstadoHistorial from "./ObsEstadoHistorial";

const ListObservaciones = ({ data }) => {
  const [open, setOpen] = useState(false);

  return (
    <div className={"text-center w-100"}>
      <AccionButton
        onClick={() => setOpen(true)}
        title={"Ver historial de estados"}
      >
        <i className={`icon-uqai uqai-ver`} />
      </AccionButton>
      {open && <ObsEstadoHistorial data={data} open={open} setOpen={setOpen} />}
    </div>
  );
};

export default ListObservaciones;
