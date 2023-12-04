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
import {
  debounce,
  defaultNuevoSiniestro,
  formatFieldValue,
  isVam,
  v_nuevoSiniestro,
} from "../utils";
import useCdUser from "../../../hooks/useCdUser";
import ModalFinanciamiento from "./ModalFinanciamiento";

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

  const [valuePolizaSelect, setValuePolizaSelect] = useState(null);
  const [valueSucursalSelect, setValueSucursalSelect] = useState(null);
  const [valueClienteSelect, setValueClienteSelect] = useState(null);
  const [valueAseguradoraSelect, setValueAseguradoraSelect] = useState(null);
  const [valueRamoSelect, setValueRamoSelect] = useState(null);
  const [valueAseguradoSelect, setValueAseguradoSelect] = useState(null);
  const [placaSelect, setPlacaSelect] = useState([]);
  const [inputPlaca, setInputPlaca] = useState(null);
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
  const [isVamResult, setIsVamResult] = useState(false);
  const [resultNewSiniestro, setResultNewSiniestro] = useState(false);
  const [financiamientoModal, setFinanciamientoModal] = useState(false);
  const [valueDiagnosticoSelect, setValueDiagnosticoSelect] = useState(null);
  const aseguradorasData = useSelector((state) => state.aseguradoras.value);
  const ramosData = useSelector((state) => state.ramos.value);
  const sucursalData = useSelector((state) => state.sucursal.value);
  const aseguradoraProperties = ["ID", "CD_ASEGURADORA"];
  const ramoProperties = ["CD_RAMO", "CD_RAMO"];
  const sucursalProperties = ["ID", "CD_COMPANIA"];

  const user = useCdUser();

  useEffect(() => {
    setStaticOptionsSelect();
  }, []);

  useEffect(() => {
    fetchData();
  }, [cdClienteAux, cdAseguradoraAux, cdRamoAux, cdSucursalAux]);

  useEffect(() => {
    const newValues = {
      cdCliente: cdClienteAux || "%",
      cdSucursal: cdSucursalAux || "%",
      cdRamo: cdRamoAux || "%",
      cdAseguradora: cdAseguradoraAux || "%",
      poliza: "%",
    };
    if (cdClienteAux) {
      searchDataPoliza(newValues);
    } else {
      setPolizaOptions([]);
    }
  }, [cdClienteAux, cdSucursalAux, cdRamoAux, cdAseguradoraAux]);

  useEffect(() => {
    const obj = {
      cdRC: valuePolizaSelect?.CD_RAMO_COTIZACION || "%",
      cdSucursal: cdSucursalAux || "%",
      poliza: valuePolizaSelect?.POLIZA || "%",
      cdCliente: cdClienteAux || "%",
      placa: inputPlaca?.toUpperCase() || "%",
    };
    axios.post(`${process.env.REACT_APP_API_URL}/placas`, obj).then((res) => {
      setPlacaSelect(res.data.slice(0, 50));
    });
  }, [valuePolizaSelect, cdSucursalAux, cdClienteAux, inputPlaca]);

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
    } else {
      searchDataAsegurados([]);
    }
  }, [cdSucursalAux, nombreRamoAux, valuePolizaSelect]);
  useEffect(() => {
    if (!nombreRamoAux) return;
    setIsVamResult(isVam(nombreRamoAux));
    // if (nombreRamoAux.toLowerCase().includes("desgravamen")) {
    // }
  }, [nombreRamoAux]);

  useEffect(() => {
    if (resultNewSiniestro) {
      const timeoutId = setTimeout(resetResult, 3000);
      return () => clearTimeout(timeoutId);
    }
  }, [resultNewSiniestro]);

  const resetResult = () => {
    setResultNewSiniestro(false);
  };
  const filterByValue = (value, array, property) => {
    return array.filter((item) => item[property] === value);
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
      if (!cdClienteAux) {
        setStaticOptionsSelect();
        return;
      }

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
      setPolizaOptions(response.data);
    } catch (error) {}
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
    } catch (error) {}
  };

  const onSubmit = async (newValues, actions, resetForm) => {
    let values = { ...newValues };
    values.fcRecepcion = formatFieldValue(values.fcRecepcion);
    values.fcEvento = formatFieldValue(values.fcEvento);
    values.usuario = user;

    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/nuevoSiniestro`,
        values
      );
      setResultNewSiniestro(true);
      actions.setSubmitting(false);
    } catch (error) {}
  };
  const handleResetForm = (resetForm) => {
    resetForm();
  };

  const setStaticOptionsSelect = () => {
    setGroupedOptionsSucursal(sucursalData);
    setGroupedOptionsRamo(ramosData);
    setGroupedOptionsAseguradora(aseguradorasData);
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
            // console.log("v_nuevoSiniestro: ", v_nuevoSiniestro);
            return (
              <div className="row my-3">
                <div className="col-2">
                  <label className="form-label fw-bold text-secondary fs-7">
                    * Cliente:
                  </label>

                  <AsyncSelect
                    isClearable
                    placeholder="Clientes"
                    value={valueClienteSelect}
                    cacheOptions
                    defaultOptions
                    loadOptions={loadOptionsClientes}
                    onChange={(valueSelect) => {
                      setValueClienteSelect(valueSelect);
                      setFieldValue("cdCliente", valueSelect?.value);
                      setCdClienteAux(valueSelect?.value);
                    }}
                  />
                </div>
                <div className="col-2">
                  <label className="form-label fw-bold text-secondary fs-7">
                    * Aseguradora:
                  </label>

                  <Select
                    placeholder="Aseguradora"
                    isClearable
                    value={valueAseguradoraSelect}
                    options={groupedOptionsAseguradora}
                    getOptionLabel={(option) => option.ALIAS}
                    getOptionValue={(option) => option.ID}
                    onChange={(valueSelect) => {
                      setFieldValue("cdAseguradora", valueSelect?.ID);
                      setCdAseguradoraAux(valueSelect?.ID);
                      setValueAseguradoraSelect(valueSelect);
                    }}
                  />
                </div>
                <div className="col-2">
                  <label className="form-label fw-bold text-secondary fs-7">
                    Ramo:
                  </label>

                  <Select
                    placeholder={"Ramo"}
                    isClearable
                    value={valueRamoSelect}
                    options={groupedOptionsRamo}
                    getOptionLabel={(option) => option.NM_RAMO}
                    getOptionValue={(option) => option.CD_RAMO}
                    onChange={(valueSelect) => {
                      setFieldValue("cdRamo", valueSelect?.CD_RAMO);
                      setFieldValue("nmRamo", valueSelect?.NM_RAMO);
                      setCdRamoAux(valueSelect?.CD_RAMO);
                      setNombreRamoAux(valueSelect?.NM_RAMO);
                      setValueRamoSelect(valueSelect);
                    }}
                  />
                </div>
                <div className="col-4">
                  <label className="form-label fw-bold text-secondary fs-7">
                    Poliza:
                  </label>
                  <Select
                    placeholder="Poliza"
                    isClearable
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
                              padding: "1px",
                              backgroundColor: "#FFFFFF",
                            }}
                            // onHover={() =>
                            //   (this.style.backgroundColor = "#DEEBFF")
                            // }
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
                      if (!valueSelect) {
                        setValuePolizaSelect(null);
                      }
                      console.log("VALUESELECT: ", valueSelect);

                      setFieldValue("poliza", valueSelect?.POLIZA);
                      setFieldValue("cdFactAseg", valueSelect?.FACT_ASEG);
                      setFieldValue("cdAnexo", valueSelect?.ANEXO);
                      setFieldValue("cdSucursal", valueSelect?.CD_COMPANIA);
                      setFieldValue("cdRC", valueSelect?.CD_RAMO_COTIZACION);

                      const sucursalObj = sucursalData.filter(
                        (item) => item.ID === valueSelect?.CD_COMPANIA
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
                    isClearable
                    value={valueAseguradoSelect}
                    options={aseguradoOptions}
                    onChange={(valueSelect) => {
                      setFieldValue("nmAsegurado", valueSelect?.value);
                      if (valueSelect.__isNew__) {
                        setFieldValue("cdAsegurado", 0);
                      } else {
                        setFieldValue("cdAsegurado", valueSelect?.value);
                      }
                      setValueAseguradoSelect(valueSelect);
                    }}
                  />
                </div>
                {isVamResult && (
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
                    isClearable
                    value={valueSucursalSelect}
                    options={groupedOptionsSucursal}
                    getOptionLabel={(option) => option.SUCURSAL}
                    getOptionValue={(option) => option.ID}
                    onChange={(valueSelect) => {
                      setFieldValue("cdSucursal", valueSelect?.ID);
                      setCdSucursalAux(valueSelect?.ID);
                      setValueSucursalSelect(valueSelect);
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
                    placeholder="Diagnostico-ca..."
                    isClearable
                    value={valueDiagnosticoSelect}
                    cacheOptions
                    defaultOptions
                    loadOptions={loadOptionsDiagnostico}
                    onChange={(valueSelect) => {
                      setFieldValue("tpDiagnostico", valueSelect?.value);
                      setFieldValue("cdDiagnostico", valueSelect?.value);
                      setFieldValue("nmDiagnostico", valueSelect?.label);
                      setValueDiagnosticoSelect(valueSelect);
                    }}
                  />
                </div>
                <div className="col-2">
                  <label className="form-label fw-bold text-secondary fs-7">
                    Placa-item:
                  </label>
                  <Select
                    placeholder="Placa-item"
                    isClearable
                    options={placaSelect}
                    onInputChange={setInputPlaca}
                    getOptionLabel={(option) => option.PLACA}
                    getOptionValue={(option) => option.PLACA}
                    onChange={(valueSelect) => {
                      // console.log("VALUESELECTED: ", valueSelect);
                      setValuePolizaSelect(valueSelect);
                      setFieldValue("placa", valueSelect?.PLACA);
                      setFieldValue("poliza", valueSelect?.POLIZA);
                      setFieldValue("cdFactAseg", valueSelect?.FACT_ASEG);
                      setFieldValue("cdAnexo", valueSelect?.ANEXO);
                      setFieldValue("cdSucursal", valueSelect?.CD_COMPANIA);
                      setFieldValue("cdCliente", valueSelect?.CD_CLIENTE);
                      setFieldValue("cdAsegurado", valueSelect?.ASEGURADO);
                      setFieldValue("cdRC", valueSelect?.CD_RAMO_COTIZACION);
                      setFieldValue(
                        "cdAseguradora",
                        valueSelect?.CD_ASEGURADORA
                      );

                      const selectSucursal = filterByValue(
                        valueSelect?.CD_COMPANIA,
                        sucursalData,
                        "ID"
                      );
                      const selectAseguradora = filterByValue(
                        valueSelect?.CD_ASEGURADORA,
                        aseguradorasData,
                        "ID"
                      );
                      const selectRamo = filterByValue(
                        valueSelect?.CD_RAMO,
                        ramosData,
                        "CD_RAMO"
                      );
                      setFieldValue("cdRamo", selectRamo?.CD_RAMO);
                      setFieldValue("nmRamo", selectRamo?.NM_RAMO);

                      setValueSucursalSelect(selectSucursal);
                      // setValueClienteSelect(getCliente(valueSelect.))
                      setValueAseguradoraSelect(selectAseguradora);
                      setValueRamoSelect(selectRamo);
                      setValueAseguradoSelect({
                        label: valueSelect?.ASEGURADO,
                        value: valueSelect?.ASEGURADO,
                      });
                      setValueClienteSelect({
                        value: valueSelect?.CD_CLIENTE,
                        label: valueSelect?.CLIENTE,
                      });
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
                      setFieldValue("cdTaller", valueSelect?.CD_TALLER);
                      //set8(valueSelect);
                      // setValuePrioridad(valueSelect);
                    }}
                  />
                </div>
                <div className="d-flex justify-content-end col-12  mt-3  ">
                  <div className="d-flex col-3 justify-content-between ">
                    <div>
                      {/* {valuePolizaSelect && (
                        <>
                          <button
                            type="button"
                            className="btn btn-success " // Agregar margen a la derecha
                            onClick={() => {
                              setFinanciamientoModal(true);
                            }}
                          >
                            <i className="icon-uqai uqai-tipo_gasto text-white"></i>
                          </button>
                        </>
                      )} */}
                    </div>

                    <div>
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
              </div>
            );
          }}
        </UqaiFormik>
        {resultNewSiniestro && (
          <div class=" d-flex justify-content-center">
            <b>Respuesta exitosa</b>
          </div>
        )}
        <ModalFinanciamiento
          open={financiamientoModal}
          setOpen={setFinanciamientoModal}
        />
      </ModalBody>
    </Modal>
  );
};

export default ModalNuevoSiniestro;
