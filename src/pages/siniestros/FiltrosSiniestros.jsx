import React, { useEffect, useRef, useState } from "react";
import PagesDBroker from "../../layout/PagesDBroker";
import { Card, CardBody, CardHeader } from "reactstrap";
import {
  PRIORIDAD_INTERVALES,
  debounce,
  defaultNuevoSiniestroFilter,
  formatFieldValue,
  isVam,
} from "./utils";
import axios from "axios";
import ReactTable from "react-table";
import "react-table/react-table.css";
import moment from "moment/moment";

import { useDispatch, useSelector } from "react-redux";
import { save_data_storage } from "./redux/estSiniestrosSlice";
import { Estados } from "./parts/Estados";
import { save_data_storage_aseguradoras } from "./redux/aseguradorasSlice";
import { save_data_storage_ramos } from "./redux/ramosSlice";
import { save_data_storage_sucursal } from "./redux/sucursalSlice";
import { save_data_storage_usuarios } from "./redux/usuariosSlice";
import { useParams } from "react-router-dom";
import CryptoJS from "crypto-js";
import FiltrosSideBarComponent from "./components/FiltrosComponent";
import LeyendaColor from "./parts/LeyendaColor";
import { save_data_storage_usuariosDBroker } from "../../features/user/userDBrokerSlice";
import ModalNuevoSiniestro from "./components/ModalNuevoSiniestro";
import Usuarios from "./parts/Usuarios";
import FcOcurrencia from "./parts/FcOcurrencia";
import ListObservaciones from "./parts/ListObservaciones";

export const FiltrosSiniestros = () => {
  const { field_valid } = useParams();
  const [data, setData] = useState({
    data: [],
    loading: false,
    pageSize: 10,
  });
  const [newQuery, setNewQuery] = useState(defaultNuevoSiniestroFilter());
  const [dbrokerUser, setDBrokerUSer] = useState(null);
  const [aseguradora, setAseguradora] = useState([]);
  const [aseguradoraSiniestro, setAseguradoraSiniestro] = useState([]);
  const [tallerSiniestro, setTallerSiniestro] = useState([]);
  const [agentes, setAgentes] = useState([]);
  const [estSiniestro, setEstSiniestro] = useState([]);
  const [ramos, setRamos] = useState([]);
  const [anios, setAnios] = useState([]);
  const [sucursal, setSucursal] = useState([]);
  const [sucursalSiniestro, setSucursalSiniestro] = useState([]);
  const [usuariosD, setUsuariosD] = useState([]);
  const [subArea, setSubArea] = useState([]);
  const [placas, setPlacas] = useState([]);
  const [taller, setTaller] = useState([]);
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
      });
  }, [field_valid]);
  useEffect(() => {}, [data]);

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
    setAnios(generateYearOptions());
  }, []);

  const getAseguradora = () => {
    axios
      .get(`${process.env.REACT_APP_API_URL}/aliasAseguradora`)
      .then((res) => {
        const dataWithTodos = [{ ID: "%", ALIAS: "TODOS" }, ...res.data];

        setAseguradora(dataWithTodos);
        setAseguradoraSiniestro(res.data);
        dispatch(save_data_storage_aseguradoras(res.data));
      });
  };
  const getAgentes = () => {
    axios.get(`${process.env.REACT_APP_API_URL}/Agentes`).then((res) => {
      const dataWithTodos = [{ ID: "%", AGENTE: "TODOS" }, ...res.data];
      setAgentes(dataWithTodos);
    });
  };
  const getEstSiniestro = () => {
    axios
      .get(`${process.env.REACT_APP_API_URL}/EstadosSiniestros`)
      .then((res) => {
        const dataWithTodos = [
          { CD_EST_SINIESTRO: "%", DSC_ESTADO: "TODOS" },
          ...res.data,
        ];
        dispatch(save_data_storage(res.data));
        setEstSiniestro(dataWithTodos);
      });
  };
  const getRamosDBroker = () => {
    axios.get(`${process.env.REACT_APP_API_URL}/Ramos`).then((res) => {
      const dataWithTodos = [{ CD_RAMO: "%", NM_RAMO: "TODOS" }, ...res.data];
      setRamos(dataWithTodos);
      dispatch(save_data_storage_ramos(res.data));
    });
  };
  const getSucursal = () => {
    axios.get(`${process.env.REACT_APP_API_URL}/Sucursales`).then((res) => {
      const dataWithTodos = [{ ID: "%", SUCURSAL: "TODOS" }, ...res.data];
      setSucursal(dataWithTodos);
      setSucursalSiniestro(res.data);
      dispatch(save_data_storage_sucursal(res.data));
    });
  };
  const getUsuariosD = () => {
    axios.get(`${process.env.REACT_APP_API_URL}/Usuarios`).then((res) => {
      const dataWithTodos = [
        { USUARIO: "%", NOMBRE: "TODOS" },
        ...res.data,
        { USUARIO: "", NOMBRE: "Sin Usuario" },
      ];
      setUsuariosD(dataWithTodos);
      dispatch(save_data_storage_usuarios(res.data));
    });
  };
  const getSubArea = () => {
    axios.get(`${process.env.REACT_APP_API_URL}/Subareas`).then((res) => {
      const dataWithTodos = [{ ID: "%", SUBAREA: "TODOS" }, ...res.data];
      setSubArea(dataWithTodos);
    });
  };
  const getPlacas = () => {
    axios.get(`${process.env.REACT_APP_API_URL}/placas`).then((res) => {
      const dataWithTodos = [
        { ID: "%", SUBAREA: "TODOS" },
        ...res.data, // Mantén los elementos existentes
      ];

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
    setData({ data: [], loading: false, pageSize: 10 });
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
    setData((prevData) => ({
      ...prevData,
      loading: true,
    }));

    const adjustDate = (check, date) => {
      return check ? formatFieldValue(date) : "01/01/1900";
    };

    let queryDbroker = { ...q };
    queryDbroker.fcIngreso = adjustDate(
      queryDbroker.checkFcIngreso,
      queryDbroker.fcIngreso
    );
    queryDbroker.fcEvento = adjustDate(
      queryDbroker.checkFcEvento,
      queryDbroker.fcEvento
    );
    queryDbroker.fcRecepcion = adjustDate(
      queryDbroker.checkFcRecepcion,
      queryDbroker.fcRecepcion
    );
    queryDbroker.fcGestion = adjustDate(
      queryDbroker.checkFcGestion,
      queryDbroker.fcGestion
    );

    queryDbroker.anio = queryDbroker.año;
    delete queryDbroker.año;

    const {
      checkFcIngreso,
      checkFcEvento,
      checkFcRecepcion,
      checkFcGestion,
      ...rest
    } = queryDbroker;
    //console.log("QUERY: ", rest);
    axios
      .post(`${process.env.REACT_APP_API_URL}/Siniestros`, rest)
      .then((res) => {
        //console.log("SINIESTROS RESPONSE: ", res);
        setData({
          data: res.data || [],
          //data: res.data.slice(0, 1) || [],
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
  const calcularDiferenciaEnDias = (date) => {
    const initialDate = moment(date, "YYYY-MM-DDTHH:mm:ss.SSSZ");
    const actualDate = moment();
    const days = actualDate.diff(initialDate, "days");
    return days;
  };

  const priorityClassName = (data) => {
    const daysDifference = calcularDiferenciaEnDias(data.FC_CREACION);
    const valueVam = isVam(data.NM_RAMO);
    const prioridades = valueVam
      ? data.SUBAREA === "MASIVOS"
        ? PRIORIDAD_INTERVALES.vam.masivos
        : PRIORIDAD_INTERVALES.vam
      : data.SUBAREA === "MASIVOS"
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
  const generateYearOptions = () => {
    const currentYear = moment().year();
    const startYear = 2000;
    const years = [{ value: "%", label: "TODOS" }];

    for (let year = currentYear; year >= startYear; year--) {
      years.push({ value: year, label: year.toString() });
    }

    return years;
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
                    taller: taller,
                    placa: placas,
                    anios: anios,
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
                          columns={[
                            {
                              Header: "Núm",
                              width: 120,
                              filterable: false,
                              accessor: "NUM_SINIESTRO",
                              id: "NUM_SINIESTRO",
                              style: {
                                textAlign: "center",
                              },
                              headerStyle: {
                                textAlign: "center",
                              },
                            },
                            {
                              Header: "Ramo",
                              width: 120,
                              filterable: false,
                              accessor: "NM_RAMO",
                              id: "CD_RAMO",
                            },
                            {
                              Header: "Fecha Evento",
                              width: 120,
                              filterable: false,
                              accessor: (d) => {
                                return !d.FC_EVENTO
                                  ? ""
                                  : moment(d.FC_EVENTO).format("DD/MM/YYYY");
                              },
                              id: "FECHA_EVENTO",
                            },
                            {
                              Header: "Fc. Recepción",
                              minResizeWidth: 10,
                              filterable: false,
                              accessor: (d) => {
                                return !d.FC_RECEPCION_BRK
                                  ? ""
                                  : moment(d.FC_RECPCION_BRK)
                                      .locale("es")
                                      .format("DD/MM/YYYY");
                              },
                              id: "FECHA_RECEPCION",
                              width: 120,
                            },
                            {
                              Header: "Fc. Ingreso",
                              minResizeWidth: 10,
                              filterable: false,
                              accessor: (d) => {
                                return !d.FC_CREACION
                                  ? ""
                                  : moment(d.FC_CREACION)
                                      .locale("es")
                                      .format("DD/MM/YYYY");
                              },
                              id: "FECHA_INGRESO",
                              width: 120,
                            },
                            {
                              Header: "Asegurado",
                              minResizeWidth: 10,
                              filterable: false,
                              accessor: "ASEGURADO",
                              id: "ASEGURADO",
                              width: 160,
                            },
                            {
                              Header: "Contratante",
                              minResizeWidth: 10,
                              filterable: false,

                              accessor: "NM_CLIENTE",
                              id: "CONTRATANTE",
                              width: 160,
                            },
                            {
                              Header: "Subagente",
                              id: "SUB_AGENTE",
                              accessor: "AGENTE",
                              filterable: false,
                              minResizeWidth: 10,
                              width: 160,
                            },
                            {
                              Header: "Poliza",
                              id: "POLIZA",
                              filterable: false,
                              accessor: "POLIZA",
                              minResizeWidth: 10,
                              width: 115,
                            },
                            {
                              Header: "Aseguradora",
                              id: "ASEGURADORA",
                              accessor: "ALIAS_ASEG",
                              filterable: false,
                              minResizeWidth: 10,
                              width: 150,
                            },
                            {
                              Header: "Diagnostico",
                              minResizeWidth: 10,
                              filterable: false,
                              accessor: "CAUSA",
                              id: "DIAGNOSTICO",
                            },
                            {
                              Header: "Placa",
                              minResizeWidth: 10,
                              filterable: false,
                              accessor: "ITEM",
                              id: "PLACA",
                            },
                            {
                              Header: "Taller",
                              minResizeWidth: 10,
                              filterable: false,
                              accessor: "TALLER",
                              id: "TALLER",
                            },
                            {
                              Header: "Estado",
                              width: 430,
                              filterable: false,
                              sortable: false,
                              accessor: "EST_SINIESTRO",
                              id: "ESTADO_PORTAL",
                              Cell: (row) => {
                                return (
                                  <>
                                    <Estados
                                      estado={{
                                        dsc_estado: row.original.EST_SINIESTRO,
                                        cd_reclamo: row.original.CD_RECLAMO,
                                        cd_sucursal: row.original.CD_COMPANIA,
                                        obs_est_siniestro:
                                          row.original.OBS_EST_SINIESTRO,
                                        fc_ult_gestion:
                                          row.original.FC_SEGUIMIENTO,
                                      }}
                                      row={row}
                                      setData={setData}
                                      data={data}
                                    />
                                  </>
                                );
                              },
                            },
                        
                            {
                              Header: "",
                              filterable: false,
                              sortable: false,
                              accessor: "",
                              id: "OBSERVACIONES_ESTADO",
                              Cell: (row) => {
                                return (
                                  <>
                                    <ListObservaciones
                                      data={{
                                        cdReclamo: row.original.CD_RECLAMO,
                                        cdSucursal: row.original.CD_COMPANIA,
                                      }}
                                    />
                                  </>
                                );
                              },
                            },
                            {
                              Header: "Comentario",
                              minResizeWidth: 10,
                              width: 200,
                              filterable: false,
                              sortable: false,
                              accessor: "OBS_EST_SINIESTRO",
                            },

                            {
                              Header: "Fc. Ocurrencia",
                              minResizeWidth: 10,
                              width: 180,
                              filterable: false,
                              accessor: (d) => {
                                return !d.FC_EVENTO
                                  ? ""
                                  : moment(d.FC_EVENTO)
                                      .locale("es")
                                      .format("DD/MM/YYYY");
                              },
                              Cell: (row) => {
                                return (
                                  <>
                                    <FcOcurrencia
                                      fcOcurrencia={{
                                        fcOcurrencia: row.original.FC_EVENTO,
                                        cdReclamo: row.original.CD_RECLAMO,
                                        cdSucursal: row.original.CD_COMPANIA,
                                      }}
                                    />
                                  </>
                                );
                              },
                              id: "FC_OCURRENCIA",
                            },
                            {
                              Header: "Usuario",
                              minResizeWidth: 10,
                              width: 300,
                              filterable: false,
                              accessor: "CD_USUARIO",
                              id: "USUARIO",
                              Cell: (row) => {
                                return (
                                  <>
                                    <Usuarios
                                      usuario={{
                                        usuario: row.original.CD_USUARIO,
                                        cd_reclamo: row.original.CD_RECLAMO,
                                        cd_sucursal: row.original.CD_COMPANIA,
                                      }}
                                    />
                                  </>
                                );
                              },
                            },
                          ]}
                          data={data.data}
                          loading={data.loading}
                          defaultPageSize={10}
                          filterable={true}
                          showPaginationTop
                          showPaginationBottom={false}
                          getTdProps={(state, rowInfo, column) => {
                            if (rowInfo && rowInfo.row) {
                              const priority = priorityClassName(
                                rowInfo.row._original
                              );
                              return {
                                style: {
                                  cursor: "pointer",
                                },
                                className: `${priority}`,
                              };
                            } else {
                              return {};
                            }
                          }}
                          className="-highlight fs-7 mi-div "
                        />
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
      const formatedData = response.data
        .map((result) => ({
          value: result.ID,
          label: `${result.NOMBRES} ${result.APELLIDOS || ""}`,
        }))
        .slice(0, 50);

      return formatedData;
    } catch (error) {
      return [];
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
      const formatedData = response.data
        .map((result) => ({
          value: result.CD_CAUSA_SIN,
          label: result.NM_CAUSA,
          ...result,
        }))
        .slice(0, 50);
      return formatedData;
    } catch (error) {
      return [];
    }
  }
};
