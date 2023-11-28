import axios from "axios";
import moment from "moment/moment";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Modal, ModalBody } from "reactstrap";
import { UqaiModalHeader } from "../../../components/UqaiModalHeader";
import UqaiFormik from "../../../components/UqaiFormik";
import AsyncSelect from "react-select/async";
import Select from "react-select";
import CreatableSelect from "react-select/creatable";
import { UqaiField } from "../../../components/UqaiField";
import DBrokerCalendario from "../../../components/DBrokerCalendario";
import { defaultNuevoSiniestro, v_nuevoSiniestro } from "../utils";

//DEVELOPMENT
const routesVam = "http://10.147.20.248:3030/api";
//LIVE
//  const routesVam = "http://127.0.0.1:3030/api";

const ModalNuevoSiniestro = ({
  open,
  setOpen,

  form,
  selectsData,
  loadOptionsClientes,
  loadOptionsDiagnostico,
}) => {
  const [newSiniestroValues, setNewSiniestroValues] = useState(
    defaultNuevoSiniestro
  );
  const [resultSearch, setResulSearch] = useState([]);
  const [valuePolizaSelect, setValuePolizaSelect] = useState(null);
  const [valueSucursalSelect, setValueSucursalSelect] = useState(null);
  const [placaSelect, setPlacaSelect] = useState(null);
  const [cdClienteAux, setCdClienteAux] = useState(null);
  const [cdRamoAux, setCdRamoAux] = useState(null);
  const [nombreRamoAux, setNombreRamoAux] = useState(null);
  const [cdAseguradoraAux, setCdAseguradoraAux] = useState(null);
  const [cdSucursalAux, setCdSucursalAux] = useState(null);
  const [groupedOptionsAseguradora, setGroupedOptionsAseguradora] = useState(
    []
  );
  const [groupedOptionsRamo, setGroupedOptionsRamo] = useState([]);
  const [groupedOptionsSucursal, setGroupedOptionsSucursal] = useState([]);
  const [polizaOptions, setPolizaOptions] = useState([]);
  const [aseguradoOptions, setAseguradoOptions] = useState([]);
  const aseguradorasData = useSelector((state) => state.aseguradoras.value);
  const ramosData = useSelector((state) => state.ramos.value);
  const sucursalData = useSelector((state) => state.sucursal.value);
  const [v0, set0] = useState(null);
  const [isVam, setIsVam] = useState(false);
  const [resultNewSiniestro, setResultNewSiniestro] = useState(false);
  const aseguradoraProperties = ["ID", "CD_ASEGURADORA"];
  const ramoProperties = ["CD_RAMO", "CD_RAMO"];
  const sucursalProperties = ["ID", "CD_COMPANIA"];

  useEffect(() => {
    fetchData();
  }, [cdClienteAux, cdAseguradoraAux, cdRamoAux, cdSucursalAux]);

  useEffect(() => {
    const newValues = {
      cdCliente: cdClienteAux || "%",
      cdSucursal: cdSucursalAux || "%",
      cdRamo: cdRamoAux || "%",
      poliza: "%",
    };
    if (cdClienteAux) searchDataPoliza(newValues);
  }, [cdClienteAux, cdSucursalAux, cdRamoAux]);

  useEffect(() => {
    if (valuePolizaSelect?.CD_RAMO_COTIZACION) {
      const obj = {
        cdRC: valuePolizaSelect.CD_RAMO_COTIZACION,
        cdSucursal: "%",
        poliza: "%", // valuePolizaSelect.POLIZA,
        cdCliente: "%", //cdClienteAux
      };
      axios.post(`${process.env.REACT_APP_API_URL}/placas`, obj).then((res) => {
        // console.log("RESPONSE PLACAS: ", res);
        setPlacaSelect(res.data);
      });
    }
  }, [valuePolizaSelect]);

  useEffect(() => {
    const newValues = {
      ram_cot: valuePolizaSelect?.CD_RAMO_COTIZACION,
      cdSucursal: valuePolizaSelect?.CD_COMPANIA,
      ramoNM: nombreRamoAux,
    };
    if (
      valuePolizaSelect &&
      valuePolizaSelect.CD_RAMO_COTIZACION &&
      valuePolizaSelect.CD_COMPANIA &&
      nombreRamoAux
    ) {
      searchDataAsegurados(newValues);
    }
  }, [cdSucursalAux, nombreRamoAux, valuePolizaSelect]);
  useEffect(() => {
    if (!nombreRamoAux) return;
    const lowerRamo = nombreRamoAux.toLowerCase();

    if (lowerRamo.includes("vida") || lowerRamo.includes("medica")) {
      setIsVam(true);
    } else {
      setIsVam(false);
    }
    if (lowerRamo.includes("desgravamen")) {
    //   console.log("RAMO? DSGRAVAMEN", lowerRamo);
    }
  }, [nombreRamoAux]);
  useEffect(() => {
    // Aquí, cuando resultNewSiniestro se establece a verdadero, iniciamos el temporizador para restablecerlo a falso después de 3 segundos
    if (resultNewSiniestro) {
      const timeoutId = setTimeout(resetResult, 3000);

      // Limpia el temporizador si el componente se desmonta antes de que se complete
      return () => clearTimeout(timeoutId);
    }
  }, [resultNewSiniestro]);

  const resetResult = () => {
    setResultNewSiniestro(false);
  };

  const filterByProperties = (item1, array2, propertys) =>
    array2.some((item2) => item1[propertys[0]] === item2[propertys[1]]);

  const filterOptionsByProperties = (options, data, filterProperties) => ({
    included: options.filter((item) =>
      filterByProperties(item, data, filterProperties)
    ),
    excluded: options.filter(
      (item) => !filterByProperties(item, data, filterProperties)
    ),
  });

  const fetchData = async () => {
    try {
      if (!cdClienteAux) return;

      const obj = {
        cdRamo: cdRamoAux || "%",
        cdSucursal: cdSucursalAux || "%",
        poliza: "%",
        cdAseguradora: cdAseguradoraAux || "%",
        cdCliente: cdClienteAux,
      };

      const res = await axios.post(
        `${process.env.REACT_APP_API_URL}/aliasAseguradora/cliente`,
        obj
      );

      const filterAseguradoras = filterOptionsByProperties(
        aseguradorasData,
        res.data,
        aseguradoraProperties
      );
      const filterRamos = filterOptionsByProperties(
        ramosData,
        res.data,
        ramoProperties
      );
      const filterSucursales = filterOptionsByProperties(
        sucursalData,
        res.data,
        sucursalProperties
      );

      setGroupedOptionsAseguradora([
        { label: "Producción", options: filterAseguradoras.included },
        { label: "Aseguradoras", options: filterAseguradoras.excluded },
      ]);

      setGroupedOptionsRamo([
        { label: "Producción", options: filterRamos.included },
        { label: "Ramos", options: filterRamos.excluded },
      ]);

      setGroupedOptionsSucursal([
        { label: "Producción", options: filterSucursales.included },
        { label: "Sucursal", options: filterSucursales.excluded },
      ]);
    } catch (error) {
      console.error("Error: ", error);
    }
  };

  const searchDataPoliza = async (values) => {
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/polizas`,
        values
      );
      // console.log("VALUES: ", values);
      // console.log("RESPONSE POliza: ", response.data);
      setResulSearch(response.data);
      setPolizaOptions(response.data);
      //return response.data;
    } catch (error) {
      console.log("ERROR: ", error);
      // return [];
    }
  };
  const searchDataAsegurados = async (values) => {
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/Asegurados`,
        values
      );

      const arrayDeObjetos = Object.keys(response.data).map((clave) => {
        return { value: response.data[clave], label: response.data[clave] };
      });

      setAseguradoOptions(arrayDeObjetos);
    } catch (error) {
      console.log("ERROR: ", error);
    }
  };
  const onSubmit = async (newValues, actions, resetForm) => {
    const backFormat = "DD/MM/YYYY";
    const formatFieldValue = (value) => moment(value).format(backFormat);
    let values = { ...newValues };
    values.fcRecepcion = formatFieldValue(values.fcRecepcion);
    values.fcEvento = formatFieldValue(values.fcEvento);

    // console.log("VALUES?_ ", values);
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/nuevoSiniestro`,
        values
      );
    //  console.log("SUCCES? : ", response);
      setResultNewSiniestro(true);
      //setNewSiniestroValues(defaultNuevoSiniestro);
 

      actions.setSubmitting(false);
    } catch (error) {
      console.log("ERROR: ", error);
    }
  };
  const handleResetForm = (resetForm) => {
    resetForm();
  };

  return (
    <Modal isOpen={open} toggle={() => setOpen(false)} size="xl" centered>
      <UqaiModalHeader
        toggle={() => setOpen(false)}
        title="AÑADIR NUEVO SINIESTRO"
      />
      <ModalBody>
        <UqaiFormik
          onSubmit={onSubmit}
          initialValues={newSiniestroValues}
          validateOnChange={true}
          enableReinitialize={true}
          handleResetForm={handleResetForm}
          ref={form}
          validationSchema={v_nuevoSiniestro}
        >
          {({ resetForm, submitForm, values, isSubmitting, setFieldValue }) => {
            // console.log("ISSUBMIT: ", isSubmitting);
            // console.log("v_nuevoSiniestro: ", v_nuevoSiniestro);
            return (
              <div className="row my-3">
                <div className="col-2">
                  <label className="form-label fw-bold text-secondary fs-7">
                    * Cliente:
                  </label>

                  <AsyncSelect
                    placeholder="Clientes"
                    cacheOptions
                    defaultOptions
                    loadOptions={loadOptionsClientes}
                    onChange={(valueSelect) => {
                      setFieldValue("cdCliente", valueSelect.value);
                      setCdClienteAux(valueSelect.value);
                    }}
                  />
                </div>
                <div className="col-2">
                  <label className="form-label fw-bold text-secondary fs-7">
                    * Aseguradora:
                  </label>

                  <Select
                    placeholder="Aseguradora"
                    options={groupedOptionsAseguradora}
                    getOptionLabel={(option) => option.ALIAS}
                    getOptionValue={(option) => option.ID}
                    onChange={(valueSelect) => {
                      setFieldValue("cdAseguradora", valueSelect.ID);
                      setCdAseguradoraAux(valueSelect.ID);
                    }}
                  />
                </div>
                <div className="col-2">
                  <label className="form-label fw-bold text-secondary fs-7">
                    Ramo:
                  </label>

                  <Select
                    placeholder={"Ramo"}
                    options={groupedOptionsRamo}
                    getOptionLabel={(option) => option.NM_RAMO}
                    getOptionValue={(option) => option.CD_RAMO}
                    onChange={(valueSelect) => {
                      setFieldValue("cdRamo", valueSelect.CD_RAMO);
                      setFieldValue("nmRamo", valueSelect.NM_RAMO);
                      setCdRamoAux(valueSelect.CD_RAMO);
                      setNombreRamoAux(valueSelect.NM_RAMO);
                    }}
                  />
                </div>
                <div className="col-4">
                  <label className="form-label fw-bold text-secondary fs-7">
                    Poliza:
                  </label>
                  <Select
                    placeholder="Poliza"
                    value={valuePolizaSelect}
                    options={polizaOptions}
                    getOptionLabel={(option) => (
                      <>
                        <b>Póliza: </b>
                        {option.POLIZA} <b>Vigencia:</b>{" "}
                        {moment(option.FC_DESDE)
                          .locale("es")
                          .format("DD/MM/YYYY")}{" "}
                        -
                        {moment(option.FC_HASTA)
                          .locale("es")
                          .format("DD/MM/YYYY")}
                      </>
                    )}
                    components={{
                      Option: (props) => {
                        return (
                          <div
                            style={{
                              display: "flex",
                              cursor: "pointer",
                              alignItems: "center",
                              padding: "1px", // Ajusta esto según tus necesidades
                              backgroundColor: "#FFFFFF", // Color de fondo predeterminado
                            }}
                            onHover={() =>
                              (this.style.backgroundColor = "#DEEBFF")
                            }
                            {...props.innerProps}
                          >
                            <div>
                              <b>Póliza: </b>
                              {props.data.POLIZA}
                            </div>
                            {"   "}
                            <div>
                              <b>Vigencia: </b>
                              {moment(props.data.FC_DESDE)
                                .locale("es")
                                .format("DD/MM/YYYY")}{" "}
                              -
                              {moment(props.data.FC_HASTA)
                                .locale("es")
                                .format("DD/MM/YYYY")}
                            </div>
                          </div>
                        );
                      },
                    }}
                    onChange={(valueSelect) => {
                      setValuePolizaSelect(valueSelect);
                      setFieldValue("poliza", valueSelect.POLIZA);
                      setFieldValue("cdFactAseg", valueSelect.FACT_ASEG);
                      setFieldValue("cdAnexo", valueSelect.ANEXO);
                      setFieldValue("cdSucursal", valueSelect.CD_COMPANIA);

                      const sucursalObj = sucursalData.filter(
                        (item) => item.ID === valueSelect.CD_COMPANIA
                      );

                      setValueSucursalSelect(sucursalObj);
                    }}
                  />
                </div>
                <div className="col-2">
                  <label className="form-label fw-bold text-secondary fs-7">
                    Asegurado-propietario:
                  </label>

                  <CreatableSelect
                    placeholder="Asegurados"
                    options={aseguradoOptions}
                    // getOptionLabel={(option) => option.asegurado}
                    // getOptionValue={(option) => option.asegurado}
                    onChange={(valueSelect) => {
                      setFieldValue("nmAsegurado", valueSelect.value);
                      if (valueSelect.__isNew__) {
                        //console.log("VALUE ASEGURADO: ", valueSelect.__isNew__);

                        setFieldValue("cdAsegurado", 0);
                      } else {
                        setFieldValue("cdAsegurado", valueSelect.value);
                      }
                      // console.log("VALUE ASEGURADO: ", valueSelect);
                    }}
                  />
                </div>
                {isVam && (
                  <div className="col-2">
                    <label className="form-label fw-bold text-secondary fs-7">
                      Titular-Dependiente:
                    </label>
                    <UqaiField
                      type="text"
                      name={"cdAsegurado"}
                      className={"form-control"}
                      placeholder={"Titular-Dependiente"}
                    />
                  </div>
                )}
                {valuePolizaSelect && (
                  <>
                    <div className="col-2">
                      <label className="form-label fw-bold text-secondary fs-7">
                        Fact Aseg.
                      </label>
                      <UqaiField
                        type="text"
                        name={"cdFactAseg"}
                        className={"form-control"}
                        placeholder={"Factura Asegurada"}
                        disabled
                      />
                    </div>
                  </>
                )}
                {valuePolizaSelect && (
                  <>
                    <div className="col-2">
                      <label className="form-label fw-bold text-secondary fs-7">
                        Anexo.
                      </label>
                      <UqaiField
                        type="text"
                        name={"cdAnexo"}
                        className={"form-control"}
                        placeholder={"Anexo"}
                        disabled
                      />
                    </div>
                  </>
                )}
                <div className="col-2">
                  <label className="form-label fw-bold text-secondary fs-7">
                    * Sucursal:
                  </label>

                  <Select
                    placeholder="Sucursal"
                    value={valueSucursalSelect}
                    options={groupedOptionsSucursal}
                    getOptionLabel={(option) => option.SUCURSAL}
                    getOptionValue={(option) => option.ID}
                    onChange={(valueSelect) => {
                      setFieldValue("cdSucursal", valueSelect.ID);
                      setCdSucursalAux(valueSelect.ID);
                      // setValuePrioridad(valueSelect);
                    }}
                  />
                </div>
                <div className="col-2">
                  <label className="form-label fw-bold text-secondary fs-7">
                    Fc. Recepcion:
                  </label>

                  <UqaiField
                    component={DBrokerCalendario}
                    type="date"
                    name="fcRecepcion"
                    className="form-control"
                    placeholder="DD/MM/AAAA"
                  />
                </div>
                <div className="col-2">
                  <label className="form-label fw-bold text-secondary fs-7">
                    Fc. Evento:
                  </label>
                  <UqaiField
                    component={DBrokerCalendario}
                    type="date"
                    name="fcEvento"
                    className="form-control"
                    placeholder="DD/MM/AAAA"
                  />
                </div>
                <div className="col-2">
                  <label className="form-label fw-bold text-secondary fs-7">
                    Diagnostico-causa:
                  </label>
                  <AsyncSelect
                    placeholder="Diagnostico-causa"
                    value={v0}
                    cacheOptions
                    defaultOptions
                    loadOptions={loadOptionsDiagnostico}
                    onChange={(valueSelect) => {
                 
                      setFieldValue("tpDiagnostico", valueSelect.value);
                      setFieldValue("cdDiagnostico", valueSelect.value);
                      setFieldValue("nmDiagnostico", valueSelect.label);
                      set0(valueSelect);
                    }}
                  />
                </div>
                <div className="col-2">
                  <label className="form-label fw-bold text-secondary fs-7">
                    Placa-item:
                  </label>
                  <Select
                    placeholder="Placa-item"
                    options={placaSelect}
                    getOptionLabel={(option) => option.PLACA}
                    getOptionValue={(option) => option.PLACA}
                    onChange={(valueSelect) => {
                      setFieldValue("placa", valueSelect.PLACA);
                      // setValuePrioridad(valueSelect);
                    }}
                  />
                </div>
                <div className="col-2">
                  <label className="form-label fw-bold text-secondary fs-7">
                    Taller:
                  </label>

                  <Select
                    // value={v8}
                    // defaultValue={selectsData.taller[0]}
                    placeholder={"Taller"}
                    options={selectsData.taller}
                    getOptionLabel={(option) => option.DSC_TALLER}
                    getOptionValue={(option) => option.CD_TALLER}
                    onChange={(valueSelect) => {
                      setFieldValue("cdTaller", valueSelect.CD_TALLER);
                      //set8(valueSelect);
                      // setValuePrioridad(valueSelect);
                    }}
                  />
                </div>
                <div className="d-flex justify-content-end col-12  mt-3  ">
                  <div className="d-flex col-3 justify-content-between ">
                    <button
                      type="button"
                      className="btn btn-danger " // Agregar margen a la derecha
                      onClick={() => {
                        setOpen(false);
                      }}
                    >
                      Cancelar
                    </button>
                    <button
                      type="button"
                      className="btn btn-alternative"
                      onClick={submitForm}
                      disabled={isSubmitting}
                    >
                      Guardar
                    </button>
                  </div>
                </div>
              </div>
            );
          }}
        </UqaiFormik>
        {resultNewSiniestro && (
          <div class=" d-flex justify-content-center">
            <b>Respuesta exitosa</b>
          </div>
        )}
      </ModalBody>
    </Modal>
  );
};

export default ModalNuevoSiniestro;
