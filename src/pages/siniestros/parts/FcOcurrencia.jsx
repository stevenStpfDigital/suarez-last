import React, { useEffect, useRef, useState } from "react";
import UqaiFormik from "../../../components/UqaiFormik";
import moment from "moment";
import { UqaiField } from "../../../components/UqaiField";
import DBrokerCalendario from "../../../components/DBrokerCalendario";
import axios from "axios";
import { formatFieldValue } from "../utils";

const FcOcurrencia = ({ fcOcurrencia }) => {
  const [fcOCurrenciaMoment, setFcOcurrenciaMoment] = useState(
    moment(fcOcurrencia.fcOcurrencia).format("YYYY-MM-DD")
  );

  const [aux, setAux] = useState(false);
  let autoSaveTimeout;
  const autoSaveFcOcurrencia = (value) => {
    clearTimeout(autoSaveTimeout);
    autoSaveTimeout = setTimeout(() => {
      if (!value) return;

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

  useEffect(() => {
    setFcOcurrenciaMoment(
      moment(fcOcurrencia.fcOcurrencia).format("YYYY-MM-DD")
    );
  }, [fcOcurrencia.fcOcurrencia]);

  const handleChange = (e) => {
    const { value } = e.target;
    setFcOcurrenciaMoment(value);
    autoSaveFcOcurrencia(value);
  };

  return (
    <>
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-12">
            <input
              className="form-control"
              placeholder="DD/MM/AAAA"
              type={"date"}
              onChange={handleChange}
              value={fcOCurrenciaMoment}
            />

            {aux && (
              <div className="text-center mt-1">
                <b>Fc. Actualizada</b>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default FcOcurrencia;
