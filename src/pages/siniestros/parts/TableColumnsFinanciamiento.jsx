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
    accessor: "ORDINAL",
    id: "ORDINAL",
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
    accessor: (d) => {
      return !d.FC_VENCIMIENTO
        ? ""
        : moment(d.FC_VENCIMIENTO).format("DD/MM/YYYY");
    },
    id: "FC_VENCIMIENTO",
  },

  {
    Header: "Prima",
    width: 120,
    filterable: false,
    accessor: (d) => {
      return d.VALOR?.toFixed(2);
    },
    id: "VALOR",
  },
  {
    Header: "Flag Pago",
    minResizeWidth: 10,
    filterable: false,
    accessor: "FLG_PAGO",
    id: "FLG_PAGO",
    width: 120,
  },
  {
    Header: "Saldo Pago",
    minResizeWidth: 10,
    filterable: false,
    accessor: (d) => {
      return d.SALDO_PAGO?.toFixed(2);
    },
    id: "SALDO_PAGO",
    width: 120,
  },
  {
    Header: "Fc. Pago",
    minResizeWidth: 10,
    filterable: false,
    accessor: (d) => {
      return !d.FC_PAGO ? "" : moment(d.FC_PAGO).format("DD/MM/YYYY");
    },
    id: "FC_PAGO",
    width: 160,
  },
  {
    Header: "Nº Factura",
    minResizeWidth: 10,
    filterable: false,
    accessor: "FACT_ASEG",
    id: "FACT_ASEG",
    width: 160,
  },
  {
    Header: "Nº Retención",
    id: "NUM_RETENCION",
    accessor: "NUM_RETENCION",
    filterable: false,
    minResizeWidth: 10,
    width: 160,
  },
  {
    Header: "Val Retención",
    id: "VAL_RETENCION",
    filterable: false,
    accessor: "VAL_RETENCION",
    minResizeWidth: 10,
    width: 115,
  },
  {
    Header: "Observaciones",
    id: "OBSERVACIONES",
    accessor: "OBSERVACIONES",
    filterable: false,
    minResizeWidth: 10,
    width: 150,
  },
];
