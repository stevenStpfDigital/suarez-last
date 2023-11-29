import React, { useRef, useState } from "react";
import UqaiFormik from "../../../components/UqaiFormik";
import moment from "moment";
import { UqaiField } from "../../../components/UqaiField";
import DBrokerCalendario from "../../../components/DBrokerCalendario";

const FcOcurrencia = ({ fcOcurrencia }) => {
  const form = useRef();
  const handleOnSubmit = (newValues, actions) => {};
  const [v3, set3] = useState(null);
  const [aux, setAux] = useState();

  return (
    <>
      <UqaiFormik
        validateOnChange={false}
        ref={form}
        initialValues={{
          fc_ocurrencia: moment(fcOcurrencia),
        }}
        onSubmit={handleOnSubmit}
      >
        {({ resetForm, submitForm, setFieldValue, values, isSubmitting }) => {
          // console.log("VALUES: ", values);
          return (
            <UqaiField
              component={DBrokerCalendario}
              type="date"
              name={"fc_ocurrencia"}
              className={"form-control"}
              placeholder={"DD/MM/AAAA"}
            />
          );
        }}
      </UqaiFormik>
    </>
  );
};

export default FcOcurrencia;
