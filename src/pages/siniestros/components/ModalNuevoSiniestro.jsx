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
  isVehiculo,
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
    defaultNuevoSiniestro()
  );

  const [valuePolizaSelect, setValuePolizaSelect] = useState(null);
  const [valueSucursalSelect, setValueSucursalSelect] = useState(null);
  const [valueClienteSelect, setValueClienteSelect] = useState(null);
  const [valueAseguradoraSelect, setValueAseguradoraSelect] = useState(null);
  const [valueRamoSelect, setValueRamoSelect] = useState(null);
  const [valueAseguradoSelect, setValueAseguradoSelect] = useState(null);
  const [valuePlacaSelect, setValuePlacaSelect] = useState(null);
  const [valueTallerSelect, setValueTallerSelect] = useState(null);
  const [valueTitularSelect, setValueTitularSelect] = useState(null);
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
  const [isVehiculosResult, setIsVehiculosResult] = useState(true);
  const [resultNewSiniestro, setResultNewSiniestro] = useState({
    state: false,
    response: null,
  });
  const [financiamientoModal, setFinanciamientoModal] = useState(false);
  const [valueDiagnosticoSelect, setValueDiagnosticoSelect] = useState(null);
  const aseguradorasData = useSelector((state) => state.aseguradoras.value);
  const ramosData = useSelector((state) => state.ramos.value);
  const sucursalData = useSelector((state) => state.sucursal.value);
  const aseguradoraProperties = ["ID", "CD_ASEGURADORA"];
  const ramoProperties = ["CD_RAMO", "CD_RAMO"];
  const sucursalProperties = ["ID", "CD_COMPANIA"];

  const [errors, setErrors] = useState(false);

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
    if (valuePolizaSelect) {
      const newValues = {
        ram_cot: valuePolizaSelect?.CD_RAMO_COTIZACION,
        cdSucursal: valuePolizaSelect?.CD_COMPANIA || cdSucursalAux,
        ramoNM: nombreRamoAux || "%",
      };
      searchDataAsegurados(newValues);
    }
  }, [cdSucursalAux, nombreRamoAux, valuePolizaSelect]);
  useEffect(() => {
    if (!nombreRamoAux) {
      setIsVamResult(false);
      setIsVehiculosResult(true);
      return;
    }
    setIsVamResult(isVam(nombreRamoAux));
    setIsVehiculosResult(isVehiculo(nombreRamoAux));
    // if (nombreRamoAux.toLowerCase().includes("desgravamen")) {
    // }
  }, [nombreRamoAux]);

  useEffect(() => {
    if (resultNewSiniestro.state) {
      const timeoutId = setTimeout(resetResult, 3500);
      return () => clearTimeout(timeoutId);
    }
  }, [resultNewSiniestro]);

  const resetResult = () => {
    setResultNewSiniestro({
      state: false,
      response: null,
    });
  };
  const filterByValue = (value, array, property) => {
    if (!value) return null;
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
    } catch (error) {}
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

      const formattData = response.data.map((res) => ({
        value: res?.CD_ASEGURADO || null,
        label: res.ASEGURADO,
      }));

      setAseguradoOptions(formattData);
    } catch (error) {
      setAseguradoOptions([]);
      setValueAseguradoSelect(null);
    }
  };

  const onSubmit = async (newValues, actions) => {
    if (
      !valueClienteSelect ||
      !valueAseguradoraSelect ||
      !valueSucursalSelect
    ) {
      setErrors(true);
      actions.setSubmitting(false);
      return;
    }

    let values = { ...newValues };
    values.fcRecepcion = formatFieldValue(values.fcRecepcion);
    values.fcEvento = formatFieldValue(values.fcEvento);
    values.usuario = user;


    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/nuevoSiniestro`,
        values
      );

      if (response.data.as_error) {
        setResultNewSiniestro({
          state: true,
          response: response.data.as_error,
        });
        setAseguradoOptions([]);
        setNewSiniestroValues(defaultNuevoSiniestro());
        setValueClienteSelect(null);
        setValueAseguradoraSelect(null);
        setValueRamoSelect(null);
        setValuePolizaSelect(null);
        setValueAseguradoSelect(null);
        setValueSucursalSelect(null);
        setValueDiagnosticoSelect(null);
        setValuePlacaSelect(null);
        setValueTallerSelect(null);
        setValueTitularSelect(null);
        setCdClienteAux(null);
        setCdAseguradoraAux(null);
        setCdRamoAux(null);
        setCdSucursalAux(null);
      }
      // console.log("NEWSINIESTRO: ", newSiniestroValues);
      actions.setSubmitting(false);
    } catch (error) {}
  };
  const handleResetForm = (resetForm) => {
    resetForm({
      values: newSiniestroValues, // Aquí proporciona tus valores iniciales
      errors: {}, // Puedes proporcionar errores iniciales si es necesario
    });
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
          // validateOnChange={true}
          enableReinitialize={true}
          handleResetForm={handleResetForm}
          ref={form}
          // validationSchema={v_nuevoSiniestro}
        >
          {({ resetForm, submitForm, values, isSubmitting, setFieldValue }) => {
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
                      if (!valueSelect) {
                        setFieldValue("cdAseguradora", null);
                        setFieldValue("cdSucursal", null);
                        setFieldValue("cdRamo", null);
                        setFieldValue("poliza", null);
                        setFieldValue("nmAsegurado", null);
                        setFieldValue("tpDiagnostico", null);
                        setFieldValue("nmDiagnostico", null);
                        setFieldValue("placa", null);
                        setFieldValue("cdTaller", null);
                        setFieldValue("cdFactAseg", null);
                        setFieldValue("cdAnexo", null);
                        setFieldValue("nmRamo", null);
                        setFieldValue("cdAsegurado", null);
                        setFieldValue("cdDiagnostico", null);
                        setValueAseguradoSelect(null);
                        setValueRamoSelect(null);
                        setAseguradoOptions([]);
                        setValueAseguradoraSelect(null);
                        setValueDiagnosticoSelect(null);
                        setValueSucursalSelect(null);

                        setFinanciamientoModal(false);
                        setValuePolizaSelect(null);
                      }
                      setValueClienteSelect(valueSelect);
                      setFieldValue("cdCliente", valueSelect?.value);
                      setCdClienteAux(valueSelect?.value);
                    }}
                  />
                  {!valueClienteSelect && errors && (
                    <span className={"invalid-feedback d-block"}>
                      Campo obligatorio
                    </span>
                  )}
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
                  {!valueAseguradoraSelect && errors && (
                    <span className={"invalid-feedback d-block"}>
                      Campo obligatorio
                    </span>
                  )}
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
                        setFieldValue("nmAsegurado", "");
                        setFieldValue("cdAsegurado", "");
                      }

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
                      setFieldValue("nmAsegurado", valueSelect?.label);
                      if (valueSelect && valueSelect.__isNew__) {
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
                    <Select
                      // value={v8}
                      // defaultValue={selectsData.taller[0]}
                      isClearable
                      placeholder={"Tipo"}
                      value={valueTitularSelect}
                      options={selectsData.titular}
                      onChange={(valueSelect) => {
                        setValueTitularSelect(valueSelect);
                        setFieldValue("tpAsegurado", valueSelect?.value);
                        //set8(valueSelect);
                        // setValuePrioridad(valueSelect);
                      }}
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
                  {!valueSucursalSelect && errors && (
                    <span className={"invalid-feedback d-block"}>
                      Campo obligatorio
                    </span>
                  )}
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
                {isVehiculosResult && (
                  <>
                    <div className="col-2">
                      <label className="form-label fw-bold text-secondary fs-7">
                        Placa-item:
                      </label>
                      <Select
                        placeholder="Placa-item"
                        isClearable
                        value={valuePlacaSelect}
                        options={placaSelect}
                        onInputChange={setInputPlaca}
                        getOptionLabel={(option) => option.PLACA}
                        getOptionValue={(option) => option.PLACA}
                        onChange={(valueSelect) => {
                          setValuePlacaSelect(valueSelect);
                          setValuePolizaSelect(valueSelect);
                          setFieldValue("placa", valueSelect?.PLACA);
                          setFieldValue("poliza", valueSelect?.POLIZA);
                          setFieldValue("cdFactAseg", valueSelect?.FACT_ASEG);
                          setFieldValue("cdAnexo", valueSelect?.ANEXO);
                          setFieldValue("cdSucursal", valueSelect?.CD_COMPANIA);
                          setFieldValue("cdCliente", valueSelect?.CD_CLIENTE);
                          // setFieldValue("cdAsegurado", valueSelect?.ASEGURADO);
                          setFieldValue("nmAsegurado", valueSelect?.ASEGURADO);
                          setFieldValue(
                            "cdRC",
                            valueSelect?.CD_RAMO_COTIZACION
                          );
                          setFieldValue(
                            "cdAseguradora",
                            valueSelect?.CD_ASEGURADORA
                          );
                          const selectRamo = filterByValue(
                            valueSelect?.CD_RAMO,
                            ramosData,
                            "CD_RAMO"
                          );
                          if (selectRamo) {
                            setFieldValue("cdRamo", selectRamo[0].CD_RAMO);
                            setFieldValue("nmRamo", selectRamo[0].NM_RAMO);
                          } else {
                            setFieldValue("cdRamo", null);
                            setFieldValue("nmRamo", null);
                          }

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

                          setValueSucursalSelect(selectSucursal);
                          setValueAseguradoraSelect(selectAseguradora);
                          setValueRamoSelect(selectRamo);

                          if (valueSelect) {
                            setValueClienteSelect({
                              value: valueSelect?.CD_CLIENTE,
                              label: valueSelect?.CLIENTE,
                            });
                            setValueAseguradoSelect({
                              label: valueSelect?.ASEGURADO,
                              value: valueSelect?.ASEGURADO,
                            });
                          } else {
                            setValueClienteSelect(null);
                            setValueAseguradoSelect(null);
                            setAseguradoOptions([]);
                          }
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
                        value={valueTallerSelect}
                        options={selectsData.taller}
                        getOptionLabel={(option) => option.DSC_TALLER}
                        getOptionValue={(option) => option.CD_TALLER}
                        onChange={(valueSelect) => {
                          setValueTallerSelect(valueSelect);
                          setFieldValue("cdTaller", valueSelect?.CD_TALLER);
                          //set8(valueSelect);
                          // setValuePrioridad(valueSelect);
                        }}
                      />
                    </div>
                  </>
                )}

                <div className="d-flex justify-content-end col-12  mt-3  ">
                  <div className="d-flex col-3 justify-content-between ">
                    <div>
                      {valuePolizaSelect && (
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
                      )}
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
        {financiamientoModal && (
          <ModalFinanciamiento
            open={financiamientoModal}
            setOpen={setFinanciamientoModal}
            valuePolizaSelect={valuePolizaSelect}
          />
        )}
        {resultNewSiniestro.state && (
          <div className=" d-flex justify-content-center">
            <p className="fs-5">
              Respuesta exitosa Siniestro{" "}
              <b> Nº {resultNewSiniestro.response} </b>
            </p>
          </div>
        )}
      </ModalBody>
    </Modal>
  );
};

export default ModalNuevoSiniestro;
