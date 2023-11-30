// import { ListObservaciones } from "../NuevoFiltrosSiniestros";

import moment from "moment/moment";
import { Estados } from "./Estados";
import { ListObservaciones } from "../FiltrosSiniestros";
import Usuarios from "./Usuarios";
import FcOcurrencia from "./FcOcurrencia";
// import TextComent from "./TextComent";

export const TableColumnsSiniestros = [
  {
    Header: "Núm",
    width: 120,
    filterable: false,
    accessor: "NUM_SINIESTRO",
    id: "NUM_SINIESTRO",
    style: {
      textAlign: "center", // Centra el contenido de la columna
    },
    headerStyle: {
      textAlign: "center", // Centra el encabezado de la columna
    },
  },
  {
    Header: "Ramo",
    width: 120,
    filterable: false,
    accessor: "NM_RAMO",
    id: "CD_RAMO",

    // Cell: (row) => {
    //   return (
    //     <div>
    //       {TIPOS.find((x) => x.value === row.original.tpReclamo)?.label}
    //     </div>
    //   );
    // },
  },

  {
    Header: "Fecha Evento",
    width: 120,
    filterable: false,
    accessor: (d) => {
      return !d.FC_EVENTO
        ? ""
        : moment(d.FC_EVENTO).locale("es").format("DD/MM/YYYY");
    },

    id: "FECHA_EVENTO",
    // Cell: (row) => {
    //   return <Estados estado={row.original.estadoPortal} />;
    // },
  },
  {
    Header: "Fc. Recepción",
    minResizeWidth: 10,
    filterable: false,
    accessor: (d) => {
      return !d.FC_RECEPCION_BRK
        ? ""
        : moment(d.FC_RECPCION_BRK).locale("es").format("DD/MM/YYYY");
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
        : moment(d.FC_CREACION).locale("es").format("DD/MM/YYYY");
    },
    id: "FECHA_INGRESO",
    //  show: isAdmin || isEjecutivo,
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
    sortable: false,
    accessor: "NM_CLIENTE",
    id: "CONTRATANTE",
    // id: "VAL_RECLAMO_PORTAL",
    width: 160,
    // Cell: (row) => {
    //   return (
    //     <CustomNumberFormat
    //       value={
    //         row?.original?.valorReclamoPortal
    //           ? row?.original?.valorReclamoPortal
    //           : 0
    //       }
    //     />
    //   );
    // },
  },
  {
    Header: "Subagente",
    id: "SUB_AGENTE",
    accessor: "AGENTE",
    filterable: false,
    // Cell: fechaPrimeraFactura,
    minResizeWidth: 10,
    width: 160,
  },
  {
    Header: "Poliza",
    id: "POLIZA",
    filterable: false,
    // accessor: (d) => {
    //   return !d.fcCreacion
    //     ? ""
    //     : moment(d.fcCreacion)
    //         .locale("moment/locale/es")
    //         .local()
    //         .format("DD/MM/YYYY");
    // },
    accessor: "POLIZA",
    minResizeWidth: 10,
    width: 115,
  },
  {
    Header: "Aseguradora",
    id: "ASEGURADORA",
    accessor: "ALIAS_ASEG",
    filterable: false,
    // Cell: (row) => {
    //   return <div>{calcularDias(row.original.fcPrimeraFactura)}</div>;
    // },
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
    // show: isAdmin || isEjecutivo,
    // Cell: (row) => {
    //   return <div>{findList(ejecutivos, row.original.cdEjecutivo)?.label}</div>;
    // },
  },
  // {
  //   Header: "Fc. Ultima Gestión",
  //   minResizeWidth: 10,
  //   filterable: false,
  //   accessor: (d) => {
  //     return !d.FC_SEGUIMIENTO
  //       ? ""
  //       : moment(d.FC_SEGUIMIENTO).locale("es").format("DD/MM/YYYY");
  //   },
  //   id: "FC_ULT_GESTION",
  // },

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
              obs_est_siniestro: row.original.OBS_EST_SINIESTRO,
              fc_ult_gestion: row.original.FC_SEGUIMIENTO,
            }}
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
        : moment(d.FC_EVENTO).locale("es").format("DD/MM/YYYY");
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
];
