import React, { useEffect, useRef, useState } from "react";
import PagesDBroker from "../../layout/PagesDBroker";
import { Offcanvas } from "react-bootstrap";
import { Card, CardBody, CardHeader, Modal, ModalBody } from "reactstrap";
import {
  PRIORIDAD_INTERVALES,
  PRIORIDAD_SELECTS,
  defaultNuevoSiniestro,
  defaultNuevoSiniestroFilter,
} from "./utils";
import UqaiFormik from "../../components/UqaiFormik";
import AsyncSelect from "react-select/async";
import Select from "react-select";
import axios from "axios";
import { UqaiField } from "../../components/UqaiField";
import {
  UqaiCalendario,
  formatDateDBroker,
} from "../../components/UqaiCalendario";
import { UqaiModalHeader } from "../../components/UqaiModalHeader";
// import { useTable } from "react-table";
import ReactTable from "react-table";
import "react-table/react-table.css";
import moment from "moment/moment";
import { TableColumnsSiniestros } from "./parts/TableColumns";
import { useDispatch, useSelector } from "react-redux";
import { save_data_storage } from "./redux/estSiniestrosSlice";
import CheckDbroker from "./parts/CheckDbroker";
import AccionButton from "./components/AccionButton";
import { Estados } from "./parts/Estados";

import CreatableSelect from "react-select/creatable";
import { save_data_storage_aseguradoras } from "./redux/aseguradorasSlice";
import { save_data_storage_ramos } from "./redux/ramosSlice";
import { save_data_storage_sucursal } from "./redux/sucursalSlice";
import { save_data_storage_usuarios } from "./redux/usuariosSlice";
import { useParams } from "react-router-dom";
import CryptoJS from "crypto-js";
import DBrokerCalendario from "../../components/DBrokerCalendario";
import ObsEstadoHistorial from "./parts/ObsEstadoHistorial";
import FiltrosSideBarComponent from "./components/FiltrosComponent";
import LeyendaColor from "./parts/LeyendaColor";
import { save_data_storage_usuariosDBroker } from "../../features/user/userDBrokerSlice";

//DEVELOPMENT
const routesVam = "http://10.147.20.248:3030/api";
//LIVE
//  const routesVam = "http://127.0.0.1:3030/api";

export const FiltrosSiniestros = () => {
  const { field_valid } = useParams();
  const [data, setData] = useState({
    data: [],
    // pages: 0,
    // page: 0,
    loading: false,
    pageSize: 10,
    sorted: [],
  });
  const [newQuery, setNewQuery] = useState(defaultNuevoSiniestroFilter());
  const [newSiniestroValues, setNewSiniestroValues] = useState(
    defaultNuevoSiniestro
  );
  const [dbrokerUser, setDBrokerUSer] = useState(null);
  const [aseguradora, setAseguradora] = useState([]);
  const [aseguradoraSiniestro, setAseguradoraSiniestro] = useState([]);
  const [tallerSiniestro, setTallerSiniestro] = useState([]);
  const [agentes, setAgentes] = useState([]);
  const [estSiniestro, setEstSiniestro] = useState([]);
  const [ramos, setRamos] = useState([]);
  const [sucursal, setSucursal] = useState([]);
  const [sucursalSiniestro, setSucursalSiniestro] = useState([]);
  const [usuariosD, setUsuariosD] = useState([]);
  const [subArea, setSubArea] = useState([]);
  const [placas, setPlacas] = useState([]);

  const [diagnostico, setDiagnostico] = useState([]);
  const [taller, setTaller] = useState([]);
  const [first, setFirst] = useState(true);
  const [newSiniestro, setNewSiniestro] = useState(false);

  const form = useRef();
  const dispatch = useDispatch();

  useEffect(() => {
   
    const secretKey = "$$vC2x1_?mK";

    if (!field_valid) return;
    const reConstructValue = (str) => {
      str = str.replace(/\_/g, "/");

      return str;
    };
    const decryptEmail = (value) => {
      const bytes = CryptoJS.AES.decrypt(value, secretKey);
      const decryptedEmail = bytes.toString(CryptoJS.enc.Utf8);
      return decryptedEmail;
    };

    const emailUser = decryptEmail(reConstructValue(field_valid));
    //DEVEOLPment
    const correo = {
      correo: "czhunio@segurossuarez.com",
    };

    axios.post(`${routesVam}/Usuarios/login`, correo).then((res) => {
      if (res.data[0]) {        
        save_data_storage_usuariosDBroker(res.data[0]);
        setDBrokerUSer(res.data[0]);
      }
    });

    console.log("EMAIL YUSER: ", JSON.parse(emailUser));
  }, [field_valid]);

  useEffect(() => {
    setNewQuery(defaultNuevoSiniestroFilter());
    setNewSiniestroValues(defaultNuevoSiniestro());

    getAseguradora();
    getAgentes();
    getEstSiniestro();
    getRamosDBroker();
    getSucursal();
    getUsuariosD();
    getSubArea();

    getTallers();
  }, []);

  const getAseguradora = () => {
    axios.get(`${routesVam}/aliasAseguradora`).then((res) => {
      const dataWithTodos = [
        { ID: "%", ALIAS: "TODOS" },
        ...res.data, // Mantén los elementos existentes
      ];

      setAseguradora(dataWithTodos);
      setAseguradoraSiniestro(res.data);
      dispatch(save_data_storage_aseguradoras(res.data));
    });
  };
  const getAgentes = () => {
    axios.get(`${routesVam}/Agentes`).then((res) => {
      const dataWithTodos = [
        { ID: "%", AGENTE: "TODOS" },
        ...res.data, // Mantén los elementos existentes
      ];

      setAgentes(dataWithTodos);
    });
  };
  const getEstSiniestro = () => {
    axios.get(`${routesVam}/EstadosSiniestros`).then((res) => {
      const dataWithTodos = [
        { CD_EST_SINIESTRO: "%", DSC_ESTADO: "TODOS" },
        ...res.data, // Mantén los elementos existentes
      ];
      dispatch(save_data_storage(res.data));
      setEstSiniestro(dataWithTodos);
    });
  };
  const getRamosDBroker = () => {
    axios.get(`${routesVam}/Ramos`).then((res) => {
      const dataWithTodos = [
        { CD_RAMO: "%", NM_RAMO: "TODOS" },
        ...res.data, // Mantén los elementos existentes
      ];
      setRamos(dataWithTodos);
      dispatch(save_data_storage_ramos(res.data));
    });
  };
  const getSucursal = () => {
    axios.get(`${routesVam}/Sucursales`).then((res) => {
      const dataWithTodos = [
        { ID: "%", SUCURSAL: "TODOS" },
        ...res.data, // Mantén los elementos existentes
      ];
      setSucursal(dataWithTodos);
      setSucursalSiniestro(res.data);
      dispatch(save_data_storage_sucursal(res.data));
    });
  };
  const getUsuariosD = () => {
    axios.get(`${routesVam}/Usuarios`).then((res) => {
      const dataWithTodos = [
        { USUARIO: "%", NOMBRE: "TODOS" },
        ...res.data, // Mantén los elementos existentes
      ];
      setUsuariosD(dataWithTodos);
      dispatch(save_data_storage_usuarios(res.data));
    });
  };
  const getSubArea = () => {
    axios.get(`${routesVam}/Subareas`).then((res) => {
      const dataWithTodos = [
        { ID: "%", SUBAREA: "TODOS" },
        ...res.data, // Mantén los elementos existentes
      ];
      setSubArea(dataWithTodos);
    });
  };
  const getPlacas = () => {
    axios.get(`${routesVam}/placas`).then((res) => {
      const dataWithTodos = [
        { ID: "%", SUBAREA: "TODOS" },
        ...res.data, // Mantén los elementos existentes
      ];
      //console.log("PLACAS: ", dataWithTodos);
      setPlacas(dataWithTodos);
    });
  };

  const getTallers = () => {
    axios.get(`${routesVam}/talleres`).then((res) => {
      const dataWithTodos = [
        { CD_TALLER: "%", DSC_TALLER: "TODOS" },
        ...res.data, // Mantén los elementos existentes
      ];

      setTaller(dataWithTodos);
      setTallerSiniestro(res.data);
    });
  };

  const handleResetForm = (resetForm) => {
    setData({ data: [], pages: 0, page: 0, loading: false, pageSize: 10 });
    resetForm();
  };

  function replaceNullsWithPercentage(object) {
    for (let key in object) {
      if (object.hasOwnProperty(key)) {
        if (object[key] === null) {
          object[key] = "%";
        }
      }
    }
    return object;
  }
  const fetchDataDbroker = (q, actions) => {
    const backFormat = "DD/MM/YYYY";
    const formatFieldValue = (value) => moment(value).format(backFormat);
    setData({
      loading: true,
      ...data,
    });

    let queryDbroker = { ...q };

    queryDbroker.anio = queryDbroker.año;
    delete queryDbroker.año;

    if (!queryDbroker.checkFcIngreso) {
      queryDbroker.fcIngreso = "01/01/1900 ";
    } else {
      queryDbroker.fcIngreso = formatFieldValue(queryDbroker.fcIngreso);
    }
    if (!queryDbroker.checkFcEvento) {
      queryDbroker.fcEvento = "01/01/1900 ";
    } else {
      queryDbroker.fcEvento = formatFieldValue(queryDbroker.fcEvento);
    }
    if (!queryDbroker.checkFcRecepcion) {
      queryDbroker.fcRecepcion = "01/01/1900 ";
    } else {
      queryDbroker.fcRecepcion = formatFieldValue(queryDbroker.fcRecepcion);
    }
    if (!queryDbroker.checkFcGestion) {
      queryDbroker.fcGestion = "01/01/1900 ";
    } else {
      queryDbroker.fcGestion = formatFieldValue(queryDbroker.fcGestion);
    }

    const {
      checkFcIngreso,
      checkFcEvento,
      checkFcRecepcion,
      checkFcGestion,
      ...rest
    } = queryDbroker;
    //console.log("QUERY: ", rest);
    axios.post(`${routesVam}/Siniestros`, rest).then((res) => {
      //console.log("SINIESTROS RESPONSE: ", res);
      setData({
        data: res.data || [],       
        loading: false,
        pageSize: 10,
      });
    });
    actions.setSubmitting(false);
  };
  const onSubmit = (newValues, actions) => {
    const formattedValues = replaceNullsWithPercentage(newValues);

    fetchDataDbroker(formattedValues, actions);
  };
  function calcularDiferenciaEnDias(date) {
    const initialDate = moment(date, "YYYY-MM-DDTHH:mm:ss.SSSZ");
    const actualDate = moment();
    const days = actualDate.diff(initialDate, "days");
    return days;
  }

  const priorityClassName = (data) => {
    const daysDifference = calcularDiferenciaEnDias(data.FC_CREACION);
    const prioridades =
      data.SUBAREA === "MASIVOS"
        ? PRIORIDAD_INTERVALES.gen.masivos
        : PRIORIDAD_INTERVALES.gen;

    if (daysDifference >= 0 && daysDifference <= prioridades.normal.diasFinal) {
      return;
    }

    if (
      daysDifference > prioridades.media.diasInicio &&
      daysDifference <= prioridades.media.diasFinal
    ) {
      return "prioridad-media";
    }

    if (daysDifference > prioridades.alta.diasInicio) {
      return "prioridad-alta";
    }
  };

  return (
    <PagesDBroker title={"Siniestros registrados"}>
      {dbrokerUser ? (
        <section className="p-1 p-md-2 p-xl-4 flex-grow-1">
          <div className="container-fluid">
            <div>
              <div className="col-12 ">
                <FiltrosSideBarComponent
                  query={newQuery}
                  onSubmit={onSubmit}
                  handleResetForm={handleResetForm}
                  selectsData={{
                    aseguradora: aseguradora,
                    agentes: agentes,
                    estSiniestro: estSiniestro,
                    ramos: ramos,
                    sucursal: sucursal,
                    usuariosD: usuariosD,
                    subArea: subArea,
                    diagnostico: diagnostico,
                    taller: taller,
                    placa: placas,
                  }}
                  loadOptionsNew={loadOptionsNew}
                  loadOptionsNewDiagnostico={loadOptionsNewDiagnostico}
                />
                <Card className="shadow">
                  <CardHeader
                    className="d-flex flex-column flex-sm-row align-items-start align-items-sm-center  border-primary justify-content-between pt-0 pb-0" //border-bottom
                  >
                    <h5 className="fw-bold">
                      <i className="icon-uqai align-middle uqai-lista-siniestros-reportados text-primary me-2"></i>
                      Lista
                    </h5>
                    <div className="col-6 row">
                      <div className="d-flex justify-content-around">
                        <LeyendaColor color={""} txt={`Prioridad Normal`} />
                        <LeyendaColor
                          color={"#FFEC0F"}
                          txt={`Prioridad Media`}
                        />
                        <LeyendaColor
                          color={"#FF1C1C"}
                          txt={`Prioridad Alta`}
                        />
                      </div>
                    </div>
                    <button
                      className="btn btn-info mt-2 mt-sm-0"
                      onClick={() => {
                        setNewSiniestro(true);
                      }}
                    >
                      Nuevo siniestro
                    </button>

                    {newSiniestro && (
                      <>
                        <ModalNewSiniestro
                          open={newSiniestro}
                          setOpen={setNewSiniestro}
                          query={newSiniestroValues}
                          form={form}
                          selectsData={{
                            aseguradora: aseguradoraSiniestro,
                            sucursal: sucursalSiniestro,
                            ramos: ramos,
                            taller: tallerSiniestro,
                          }}
                        />
                      </>
                    )}
                  </CardHeader>
                  <CardBody className="pt-0">
                    <div className="row">
                      <div className="col">
                        <ReactTable
                          noDataText={<></>}
                          loadingText={"Cargando..."}
                          rowsText={"filas"}
                          ofText={"de"}
                          previousText={"Anterior"}
                          nextText={"Siguiente"}
                          pageText={"Página"}
                          columns={TableColumnsSiniestros}
                          // manual
                          data={data.data}
                          // pages={data.pages}
                          loading={data.loading}
                          defaultPageSize={10}
                          filterable={true}
                          showPaginationTop
                          showPaginationBottom={false}
                          // onFetchData={(state) =>
                          //   fetchData({
                          //     ...newQuery,
                          //     page: state.page,
                          //     pageSize: state.pageSize,
                          //     sorted: state.sorted,
                          //     filtered: state.filtered,
                          //   })
                          // }
                          getTdProps={(state, rowInfo, column) => {
                            if (rowInfo && rowInfo.row) {
                              // console.log("RowInfo: ", rowInfo.row);
                              const priority = priorityClassName(
                                rowInfo.row._original
                              );

                              return {
                                onClick: (e, handleOriginal) => {
                                  if (column.Header !== "Observación") {
                                    // history.push(
                                    //   `/vam/reportar-siniestro/${rowInfo.original.cdCompania}/${rowInfo.original.cdReclamo}/${rowInfo.original.cdIncSiniestro}`
                                    // );
                                  }
                                  if (handleOriginal) {
                                    handleOriginal();
                                  }
                                },
                                style: {
                                  cursor: "pointer",
                                },
                                className: `${priority}`,
                              };
                            } else {
                              return {};
                            }
                          }}
                          // page={data.page}
                          // pageSize={data.pageSize}
                          // onPageChange={(page) => setData({ ...data, page })}
                          // onPageSizeChange={(pageSize, page) => {
                          //   setData({ ...data, page, pageSize });
                          // }}
                          className="-highlight fs-7 mi-div "
                        ></ReactTable>
                      </div>
                    </div>
                  </CardBody>
                </Card>
              </div>
            </div>
          </div>
        </section>
      ) : (
        <section className="container mt-5 d-flex justify-content-center">
          <h3>
            El usuario no se encuentra en nuestro sistema, contactese con el
            administrador del sistema
          </h3>
        </section>
      )}
    </PagesDBroker>
  );
};

function debounce(func, delay) {
  let timer;
  return function () {
    clearTimeout(timer);
    timer = setTimeout(() => func.apply(this, arguments), delay);
  };
}

const loadOptionsNew = debounce(async (inputValue, callback) => {
  callback(await getContratantesByInputValue(inputValue));
});
const getContratantesByInputValue = async (inputValue) => {
  if (inputValue.length >= 3) {
    try {
      const response = await axios.get(`${routesVam}/Clientes/${inputValue}`);

      const formatedData = response.data.slice(0, 50).map((result) => ({
        value: result.ID,
        label: `${result.NOMBRES} ${result.APELLIDOS || null}`,
      }));

      return formatedData;
      // Mostrar los resultados en el frontend
    } catch (error) {
      console.error("Error al obtener datos:", error);
      return [];
      // Manejar el error y mostrar un mensaje al usuario si es necesario
    }
  }
};
const loadOptionsNewDiagnostico = debounce(async (inputValue, callback) => {
  callback(await getDiagnosticoByInputValue(inputValue));
});
const getDiagnosticoByInputValue = async (inputValue) => {
  if (inputValue.length >= 3) {
    try {
      const response = await axios.get(
        `${routesVam}/Diagnosticos/${inputValue}`
      );

      const formatedData = response.data.slice(0, 50).map((result) => ({
        value: result.CD_CAUSA_SIN,
        label: result.NM_CAUSA,
        ...result,
      }));

      //console.log("FORMATED DATA: ", formatedData);

      return formatedData;
      // Mostrar los resultados en el frontend
    } catch (error) {
      console.error("Error al obtener datos:", error);
      return [];
      // Manejar el error y mostrar un mensaje al usuario si es necesario
    }
  }
};

const ModalNewSiniestro = ({ open, setOpen, query, form, selectsData }) => {
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
      axios.post(`${routesVam}/placas`, obj).then((res) => {
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
        `${routesVam}/aliasAseguradora/cliente`,
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
      // console.log(
      //   "FILTERASEGURADORAS: ",
      //   filterAseguradoras.included.length,
      //   "Exlu_",
      //   filterAseguradoras.excluded.length
      // );

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
      const response = await axios.post(`${routesVam}/polizas`, values);
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
      const response = await axios.post(`${routesVam}/Asegurados`, values);

      const arrayDeObjetos = Object.keys(response.data).map((clave) => {
        return { value: response.data[clave], label: response.data[clave] };
      });
      // console.log("PARAMS_ ", values);

      // console.log("RESPONSE RAW: ", response);

      setAseguradoOptions(arrayDeObjetos);
      //return response.data;
    } catch (error) {
      console.log("ERROR: ", error);
      //return [];
    }
  };
  const onSubmit = async (newValues, actions) => {
    const backFormat = "DD/MM/YYYY";
    const formatFieldValue = (value) => moment(value).format(backFormat);
    let values = { ...newValues };
    values.fcRecepcion = formatFieldValue(values.fcRecepcion);
    values.fcEvento = formatFieldValue(values.fcEvento);

    //  console.log("VALUES?_ ", values);
    try {
      const response = await axios.post(`${routesVam}/nuevoSiniestro`, values);
      // console.log("SUCCES? : ", response);
      setResultNewSiniestro(true);
    } catch (error) {
      console.log("ERROR: ", error);
    }
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
          initialValues={query}
          validateOnChange={false}
          ref={form}
        >
          {({ submitForm, values, isSubmitting, setFieldValue }) => {
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
                    loadOptions={loadOptionsNew}
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
                      // setValuePrioridad(valueSelect);
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
                    //defaultOptions
                    // loadOptions={(input, callback) => {
                    //   if (
                    //     values.cdCliente &&
                    //     values.cdSucursal &&
                    //     values.cdRamo
                    //   ) {
                    //     loadOptions(values, callback);
                    //   }
                    // }}
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
                      // setFieldValue(
                      //   "cdAsegurado",
                      //   resultSearch[0].CD_COTIZACION
                      // );
                      // setFieldValue("cdPlaca", resultSearch[0].CD_COTIZACION);
                    }}
                  />
                </div>
                <div className="col-2">
                  <label className="form-label fw-bold text-secondary fs-7">
                    Asegurado-propietario:
                  </label>
                  {/* <UqaiField
                    type="text"
                    name={"cdAsegurado"}
                    className={"form-control"}
                    placeholder={"Asegurado"}
                  /> */}
                  {/* <AsyncCreatableSelect
                    cacheOptions
                    defaultOptions
                    loadOptions={loadOptionsAsegurado}
                  /> */}
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
                    loadOptions={loadOptionsNewDiagnostico}
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
                {/* <div className="col-2">
                  <label className="form-label fw-bold text-secondary fs-7">
                    Taller:
                  </label>
                  <UqaiField
                    type="text"
                    component="select"
                    className="form-select"
                    name="cdTaller"
                  >
                    {[].map((opt) => (
                      <option key={opt.label} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </UqaiField>
                </div> */}
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

export const ListObservaciones = ({ data, ...props }) => {
  const [open, setOpen] = useState(false);

  return (
    // <LoadingContextProvider>
    <div className={props?.className ?? "text-center w-100"}>
      <AccionButton
        onClick={() => setOpen(true)}
        title={"Ver historial de estados"}
      >
        <i className={`icon-uqai uqai-ver`} />
      </AccionButton>
      {open && <ObsEstadoHistorial data={data} open={open} setOpen={setOpen} />}
    </div>
    // </LoadingContextProvider>
  );
};
