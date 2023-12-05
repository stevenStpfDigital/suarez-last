import React, { useRef } from "react";
import UqaiFormik from "../../../components/UqaiFormik";
import { UqaiField } from "../../../components/UqaiField";

const TextComent = (txt) => {

  const form = useRef();

  return (
    <UqaiFormik validateOnChange={false} ref={form} initialValues={txt}>
      <UqaiField
        type="text"
        name={"txt"}
        className={"form-control"}
        placeholder={"Placa"}
      />
    </UqaiFormik>
  );
};

export default TextComent;
