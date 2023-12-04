// import { ListObservaciones } from "../NuevoFiltrosSiniestros";

import moment from "moment/moment";
import { Estados } from "./Estados";
import { ListObservaciones } from "../FiltrosSiniestros";
import Usuarios from "./Usuarios";
import FcOcurrencia from "./FcOcurrencia";
// import TextComent from "./TextComent";

export const TableColumnsFinanciamiento = [
  {
    Header: "Nº Cuota",
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
    Header: "Fc. Vencimiento",
    width: 120,
    filterable: false,
    accessor: "NM_RAMO",
    id: "CD_RAMO",
  },

  {
    Header: "Prima",
    width: 120,
    filterable: false,
    accessor: (d) => {
      return !d.FC_EVENTO ? "" : moment(d.FC_EVENTO).format("DD/MM/YYYY");
    },
    id: "FECHA_EVENTO",  
  },
  {
    Header: "Flag Pago",
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
    Header: "Saldo Pago",
    minResizeWidth: 10,
    filterable: false,
    accessor: (d) => {
      return !d.FC_CREACION
        ? ""
        : moment(d.FC_CREACION).locale("es").format("DD/MM/YYYY");
    },
    id: "FECHA_INGRESO",
    width: 120,
  },
  {
    Header: "Fc. Pago",
    minResizeWidth: 10,
    filterable: false,
    accessor: "ASEGURADO",
    id: "ASEGURADO",
    width: 160,
  },
  {
    Header: "Nº Factura",
    minResizeWidth: 10,
    filterable: false,
    accessor: "NM_CLIENTE",
    id: "CONTRATANTE",
    width: 160,

  },
  {
    Header: "Nº Retención",
    id: "SUB_AGENTE",
    accessor: "AGENTE",
    filterable: false,
    minResizeWidth: 10,
    width: 160,
  },
  {
    Header: "Val Retención",
    id: "POLIZA",
    filterable: false,
    accessor: "POLIZA",
    minResizeWidth: 10,
    width: 115,
  },
  {
    Header: "Observaciones",
    id: "ASEGURADORA",
    accessor: "ALIAS_ASEG",
    filterable: false,
    minResizeWidth: 10,
    width: 150,
  },
];
