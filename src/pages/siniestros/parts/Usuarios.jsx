import React, { useEffect, useRef, useState } from "react";
import UqaiFormik from "../../../components/UqaiFormik";
import Select from "react-select";
import { useSelector } from "react-redux";
import axios from "axios";

//DEVELOPMENT
//const routesVam = "http://10.147.20.248:3030/api";
//LIVE
const routesVam = "http://localhost:3030/api";
const Usuarios = ({ usuario }) => {
  const form = useRef();
  const usuariosData = useSelector((state) => state.usuario.value);
  const [v3, set3] = useState(null);
  const [aux, setAux] = useState();
  const usuariObj = usuariosData.filter(
    (item) => item.USUARIO === usuario.usuario
  );

  useEffect(() => {
    if (usuariObj.length > 0) {
      set3(usuariObj);
    }
  }, [usuariosData]);

  const handleOnSubmit = (newValues, actions) => {
    const usuarioUpdate = {
      cdReclamo: usuario.cd_reclamo,
      cdSucursal: usuario.cd_sucursal,
      usuario: newValues.cdUsuario,
    };

    axios.post(`${routesVam}/Usuarios/modificar`, usuarioUpdate).then((res) => {
      // console.log("RES SUCCESS: ", res);
    });
    actions.setSubmitting(false);
    setAux(false);
  };

  return (
    <>
      <UqaiFormik
        validateOnChange={false}
        ref={form}
        initialValues={{
          cdUsuario: null,
        }}
        onSubmit={handleOnSubmit}
      >
        {({ resetForm, submitForm, setFieldValue, isSubmitting }) => (
          <div className="row ">
            <Select
              className="col-12"
              menuPortalTarget={document.body}
              value={v3}
              options={usuariosData}
              getOptionLabel={(option) => option.NOMBRE}
              getOptionValue={(option) => option.USUARIO}
              onChange={(valueSelect) => {
                setFieldValue("cdUsuario", valueSelect.USUARIO);
                setAux(true);
                set3(valueSelect);
              }}
            />
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
                    set3(usuariObj);
                    setAux(false);
                    resetForm(resetForm);
                  }}
                >
                  <i className="icon-uqai uqai-cerrar text-danger"></i>
                </button>
              </div>
            )}
          </div>
        )}
      </UqaiFormik>
    </>
  );
};

export default Usuarios;
