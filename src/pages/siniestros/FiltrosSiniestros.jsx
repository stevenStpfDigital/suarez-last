import React, { useEffect, useRef, useState } from "react";
import PagesDBroker from "../../layout/PagesDBroker";
import { Offcanvas } from "react-bootstrap";
import { Card, CardBody, CardHeader, Modal, ModalBody } from "reactstrap";
import {
  PRIORIDAD_INTERVALES,
  PRIORIDAD_SELECTS,
  debounce,
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
import ModalNuevoSiniestro from "./components/ModalNuevoSiniestro";



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
    if (!field_valid) return;
    const reConstructValue = (str) => {
      str = str.replace(/\_/g, "/");

      return str;
    };
    const decryptEmail = (value) => {
      const bytes = CryptoJS.AES.decrypt(
        value,
        process.env.REACT_APP_SECRET_KEY
      );
      const decryptedEmail = bytes.toString(CryptoJS.enc.Utf8);
      return decryptedEmail;
    };

    const emailUser = decryptEmail(reConstructValue(field_valid));
    const emailUserJson = JSON.parse(emailUser);

    const correo = {
      correo: emailUserJson.email,
      //correo: "czhunio@segurossuarez.com",
    };

    axios
      .post(`${process.env.REACT_APP_API_URL}/Usuarios/login`, correo)
      .then((res) => {
        if (res.data[0]) {
          dispatch(save_data_storage_usuariosDBroker(res.data[0]));
          setDBrokerUSer(res.data[0]);
        }
      })
      .catch((error) => {
        console.log("ERROR: ", error);
      });

    // console.log("USER DATA: ", emailUserJson);
  }, [field_valid]);

  useEffect(() => {
    setNewQuery(defaultNuevoSiniestroFilter());

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
    axios
      .get(`${process.env.REACT_APP_API_URL}/aliasAseguradora`)
      .then((res) => {
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
    axios.get(`${process.env.REACT_APP_API_URL}/Agentes`).then((res) => {
      const dataWithTodos = [
        { ID: "%", AGENTE: "TODOS" },
        ...res.data, // Mantén los elementos existentes
      ];

      setAgentes(dataWithTodos);
    });
  };
  const getEstSiniestro = () => {
    axios
      .get(`${process.env.REACT_APP_API_URL}/EstadosSiniestros`)
      .then((res) => {
        const dataWithTodos = [
          { CD_EST_SINIESTRO: "%", DSC_ESTADO: "TODOS" },
          ...res.data, // Mantén los elementos existentes
        ];
        dispatch(save_data_storage(res.data));
        setEstSiniestro(dataWithTodos);
      });
  };
  const getRamosDBroker = () => {
    axios.get(`${process.env.REACT_APP_API_URL}/Ramos`).then((res) => {
      const dataWithTodos = [
        { CD_RAMO: "%", NM_RAMO: "TODOS" },
        ...res.data, // Mantén los elementos existentes
      ];
      setRamos(dataWithTodos);
      dispatch(save_data_storage_ramos(res.data));
    });
  };
  const getSucursal = () => {
    axios.get(`${process.env.REACT_APP_API_URL}/Sucursales`).then((res) => {
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
    axios.get(`${process.env.REACT_APP_API_URL}/Usuarios`).then((res) => {
      const dataWithTodos = [
        { USUARIO: "%", NOMBRE: "TODOS" },
        ...res.data, // Mantén los elementos existentes
        { USUARIO: "", NOMBRE: "Sin Usuario" },
      ];
      setUsuariosD(dataWithTodos);
      dispatch(save_data_storage_usuarios(res.data));
    });
  };
  const getSubArea = () => {
    axios.get(`${process.env.REACT_APP_API_URL}/Subareas`).then((res) => {
      const dataWithTodos = [
        { ID: "%", SUBAREA: "TODOS" },
        ...res.data, // Mantén los elementos existentes
      ];
      setSubArea(dataWithTodos);
    });
  };
  const getPlacas = () => {
    axios.get(`${process.env.REACT_APP_API_URL}/placas`).then((res) => {
      const dataWithTodos = [
        { ID: "%", SUBAREA: "TODOS" },
        ...res.data, // Mantén los elementos existentes
      ];
      //console.log("PLACAS: ", dataWithTodos);
      setPlacas(dataWithTodos);
    });
  };

  const getTallers = () => {
    axios.get(`${process.env.REACT_APP_API_URL}/talleres`).then((res) => {
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
    console.log("QUERY: ", rest);
    axios
      .post(`${process.env.REACT_APP_API_URL}/Siniestros`, rest)
      .then((res) => {
        console.log("SINIESTROS RESPONSE: ", res);
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
                        <ModalNuevoSiniestro
                          open={newSiniestro}
                          setOpen={setNewSiniestro}
                          form={form}
                          selectsData={{
                            aseguradora: aseguradoraSiniestro,
                            sucursal: sucursalSiniestro,
                            ramos: ramos,
                            taller: tallerSiniestro,
                          }}
                          loadOptionsClientes={loadOptionsNew}
                          loadOptionsDiagnostico={loadOptionsNewDiagnostico}
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
        <section className="container mt-5 d-flex flex-column align-items-center">
          <h3 className="text-center">
            El usuario no se encuentra registrado en nuestro sistema. Para más
            información, contáctese con el administrador:
            <a href="mailto:servicedesk@stpfdigital.com" className="ml-2">
              servicedesk@stpfdigital.com
            </a>
            .
          </h3>
        </section>
      )}
    </PagesDBroker>
  );
};

const loadOptionsNew = debounce(async (inputValue, callback) => {
  callback(await getContratantesByInputValue(inputValue));
});
const getContratantesByInputValue = async (inputValue) => {
  if (inputValue.length >= 3) {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/Clientes/${inputValue}`
      );

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
        `${process.env.REACT_APP_API_URL}/Diagnosticos/${inputValue}`
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
const getPlacasByInputValue = async (inputValue) => {
  if (inputValue.length >= 2) {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/Placas/${inputValue}`
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
