import React, { useRef, useState } from "react";
import UqaiFormik from "../../../components/UqaiFormik";
import moment from "moment";
import { UqaiField } from "../../../components/UqaiField";
import DBrokerCalendario from "../../../components/DBrokerCalendario";
import axios from "axios";
import { formatFieldValue } from "../utils";

const FcOcurrencia = ({ fcOcurrencia }) => {
  const form = useRef();
  const handleOnSubmit = (newValues, actions) => {};
  const [v3, set3] = useState(null);
  const [aux, setAux] = useState(false);
  let autoSaveTimeout;
  const autoSaveFcOcurrencia = (value) => {
    clearTimeout(autoSaveTimeout);
    autoSaveTimeout = setTimeout(() => {
      if (!value) return;
      console.log("IN?: ", value);
      const obj = {
        cdReclamo: fcOcurrencia.cdReclamo,
        cdSucursal: fcOcurrencia.cdSucursal,
        fcOcurrencia: formatFieldValue(value),
      };

      axios
        .post(`${process.env.REACT_APP_API_URL}/ocurrencia/modificar`, obj)
        .then((res) => {
          setAux(true);
          setTimeout(() => {
            setAux(false);
          }, 2000);
        });
    }, 1000);
  };

  return (
    <>
      <UqaiFormik
        validateOnChange={false}
        ref={form}
        initialValues={{
          fc_ocurrencia: moment(fcOcurrencia.fcOcurrencia),
        }}
        onSubmit={handleOnSubmit}
      >
        {({ resetForm, submitForm, setFieldValue, values, isSubmitting }) => {
          // console.log("VALUES: ", values);
          return (
            <div class="container">
              <div class="row justify-content-center">
                <div class="col-12">
                  <UqaiField
                    component={DBrokerCalendario}
                    type="date"
                    name={"fc_ocurrencia"}
                    className={"form-control"}
                    placeholder={"DD/MM/AAAA"}
                    autoSaveCallback={autoSaveFcOcurrencia}
                  />
                  {aux && (
                    <div class="text-center mt-1">
                      <b>Fc. Actualizada</b>
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        }}
      </UqaiFormik>
    </>
  );
};

export default FcOcurrencia;
