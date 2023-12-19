import React, { useEffect, useRef, useState } from "react";
//import { ESTADOS_CLASS_IMAGEN, ESTADOS_CLASS_LABEL } from "../utils";
import UqaiFormik from "../../../components/UqaiFormik";
// import { UqaiField } from "../../../components/UqaiField";
// import { ESTADOS_PORTAL_LISTA } from "../estados_edicion";
// import { useEffect } from "react";
// import { useFormikContext } from "formik";
import { useSelector } from "react-redux";
import Select from "react-select";
import TextComent from "./TextComent";
import { UqaiField } from "../../../components/UqaiField";
import axios from "axios";
import { UqaiCalendario } from "../../../components/UqaiCalendario";
import moment from "moment/moment";
import DBrokerCalendario from "../../../components/DBrokerCalendario";
import { formatFieldValue } from "../utils";
import useCdUser from "../../../hooks/useCdUser";
import DBrokerText from "../../../components/DBrokerText";

export const Estados = ({ estado, row, data, setData }) => {
  const form = useRef();
  const siniestrosData = useSelector((state) => state.estSiniestros.value);

  const [v3, set3] = useState(null);
  const [aux, setAux] = useState();

  const [EST_SINIESTRO, setEST_SINIESTRO] = useState();
  const user = useCdUser();

  const estadoObj = siniestrosData.filter(
    (item) => item.DSC_ESTADO === estado.dsc_estado
  );
  useEffect(() => {
    if (estadoObj.length > 0) {
      set3(estadoObj);
    }
  }, [siniestrosData]);

  const resetForm = (resetForm) => {
    resetForm();
  };

  const handleOnSubmit = (newValues, actions) => {
    const nuevoSiniestro = {
      cd_reclamo: estado.cd_reclamo,
      cd_sucursal: estado.cd_sucursal,
      //REVISAR NO ESTA FUNCIONANDO LA FECHA  28-11-2023
      //fc_inspecion: formatFieldValue(newValues.fc_ult_gestion),
      observacion: newValues.txt,
      usuario: user,
      cd_estado_siniestro: newValues.cd_estado_siniestro,
    };

    axios
      .post(`${process.env.REACT_APP_API_URL}/nuevoSeguimiento`, nuevoSiniestro)
      .then((res) => {
        const auxData = { ...data };
        auxData["data"][row.index]["OBS_EST_SINIESTRO"] = newValues.txt;
        auxData["data"][row.index]["EST_SINIESTRO"] = EST_SINIESTRO;
        auxData["data"][row.index]["FC_SEGUIMIENTO"] =
          moment().format("YYYY-MM-DDTHH:mm");

        setData(auxData);
        // setFcInspeccion(moment().format("YYYY-MM-DDTHH:mm"));

        actions.setSubmitting(false);
        setAux(false);
      });
  };

  return (
    <>
      <UqaiFormik
        validateOnChange={false}
        ref={form}
        initialValues={{
          txt: null,
          cd_estado_siniestro: null,
        }}
        onSubmit={handleOnSubmit}
      >
        {({ resetForm, submitForm, setFieldValue, values, isSubmitting }) => (
          <div className="container">
            <div className="row  ">
              <div className="col-4">
                <Select
                  menuPortalTarget={document.body}
                  value={v3}
                  options={siniestrosData}
                  getOptionLabel={(option) => option.DSC_ESTADO}
                  getOptionValue={(option) => option.CD_EST_SINIESTRO}
                  onChange={(valueSelect) => {
                    setEST_SINIESTRO(valueSelect.DSC_ESTADO);
                    setFieldValue(
                      "cd_estado_siniestro",
                      valueSelect.CD_EST_SINIESTRO
                    );
                    setAux(true);
                    set3(valueSelect);
                    // setValuePrioridad(valueSelect);
                  }}
                />
              </div>

              <div className="col-4 ">
                <UqaiField
                  component={DBrokerText}
                  type="text"
                  name={"txt"}
                  className={"form-control"}
                  placeholder={estado.obs_est_siniestro}
                />
              </div>
              <div className="col-4 d-flex align-items-center">
                <div>
                  <p className="m-0">
                    {estado.fc_ult_gestion
                      ? moment(estado.fc_ult_gestion)
                          .locale("es")
                          .format("DD/MM/YYYY HH:mm:ss")
                      : ""}
                  </p>
                </div>
              </div>

              {aux && (
                <div className="row">
                  <button
                    className="btn  mr-2 col-6"
                    onClick={submitForm}
                    disabled={isSubmitting}
                  >
                    <i className="icon-uqai uqai-estado-aprobado text-alternative "></i>
                  </button>
                  <button
                    className="btn col-6 "
                    onClick={() => {
                      set3(estadoObj);
                      setAux(false);
                      resetForm(resetForm);
                    }}
                  >
                    <i className="icon-uqai uqai-cerrar text-danger"></i>
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </UqaiFormik>
    </>
    // <UqaiFormik validateOnChange={false} ref={form} initialValues={estado}>
    //   {() => (
    //     <UqaiField
    //       type="text"
    //       name="estado"
    //       component="select"
    //       className="form-select"
    //     >
    //       {ESTADOS_CLASS_LABEL.map((est) => (
    //         <option value={est.value} key={est.value}>
    //           {est.label}
    //         </option>
    //       ))}
    //     </UqaiField>
    //   )}
    // </UqaiFormik>
  );
};
