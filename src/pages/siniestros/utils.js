import moment from "moment/moment";
import * as yup from "yup";

function firstDayMonth() {
  let date = moment({ year: 2000, month: 0, day: 1 });
  // let date = new Date();
  // date.setFullYear(date.getFullYear() - 1);
  return date;
}

function actualDate() {
  // let date = new Date(2000, 0, 1);
  let date = moment();
  //date.setFullYear(date.getFullYear() - 1);
  return date;
}

export const defaultNuevoSiniestroFilter = (user) => {
  return {
    cdCliente: "%",
    poliza: null,
    numSiniestro: null,
    año: null,
    cdAseguradora: "%",
    cdAgente: "%",
    cdEstado: "%",
    cdRamo: "%",
    cdSucursal: "%",
    cdUsuario: user || "%",
    fcIngreso: firstDayMonth(),
    fcEvento: firstDayMonth(),
    fcRecepcion: firstDayMonth(),
    fcGestion: firstDayMonth(),
    cdSubarea: "%",
    cdPrioridad: "%",
    cdDiagnostico: "%",
    cdPlaca: null,
    cdTaller: "%",
    checkFcIngreso: false,
    checkFcEvento: false,
    checkFcRecepcion: false,
    checkFcGestion: false,
  };
};

export const defaultNuevoSiniestro = () => {
  return {
    cdCliente: null,
    cdAseguradora: null,
    cdSucursal: null,
    fcRecepcion: actualDate(),
    cdRamo: null,
    poliza: null,
    fcEvento: actualDate(),
    nmAsegurado: null,
    tpDiagnostico: null,
    nmDiagnostico: null,
    placa: null,
    cdTaller: null,
    usuario: "broker",
    cdRC: null,
    cdFactAseg: null,
    cdAnexo: null,
    nmRamo: null,
    cdAsegurado: null,
    cdDiagnostico: null,
  };
};

export const PRIORIDAD_INTERVALES = {
  gen: {
    masivos: {
      normal: {
        diasInicio: 0,
        diasFinal: 25,
      },
      media: {
        diasInicio: 26,
        diasFinal: 45,
      },
      alta: {
        diasInicio: 46,
      },
    },
    normal: {
      diasInicio: 0,
      diasFinal: 30,
    },
    media: {
      diasInicio: 31,
      diasFinal: 60,
    },
    alta: {
      diasInicio: 61,
    },
  },
  vam: {
    masivos: {
      normal: {
        diasInicio: 0,
        diasFinal: 25,
      },
      media: {
        diasInicio: 26,
        diasFinal: 45,
      },
      alta: {
        diasInicio: 46,
      },
    },
    normal: {
      diasInicio: 0,
      diasFinal: 15,
    },
    media: {
      diasInicio: 15,
      diasFinal: 30,
    },
    alta: {
      diasInicio: 31,
    },
  },
};

export const PRIORIDAD_SELECTS = [
  { color: "none", value: "TODOS", label: "TODOS" },
  { color: "none", value: 0, label: "NORMAL" },
  { color: "#FFEC0F", value: 1, label: "MEDIA" },
  { color: "#FF1C1C", value: 2, label: "ALTA" },
];

export const AUX_CHECK_CONTROLLER = [
  "checkFcIngreso",
  "checkFcEvento",
  "checkFcRecepcion",
  "checkFcGestion",
];

const REQUERIDO = "Campo requerido";

// export const v_filtro = yup.object().shape({
//   fcCreacionDesde: yup.date().required(REQUERIDO).typeError("Fecha inválida"),
//   fcCreacionHasta: yup
//     .date()
//     .required(REQUERIDO)
//     .test(
//       "test fcCreacionHasta",
//       "Fecha inválida - Debe ser mayor o igual a Fc.Creación Desde",
//       (value, context) => {
//         const fcDdesde = context.parent.fcCreacionDesde;
//         return getDaysBetweenDates(fcDdesde, value) >= 0;
//       }
//     )
//     .typeError("Fecha inválida"),
//   fcIncurrenciaDesde: yup
//     .date()
//     .required(REQUERIDO)
//     .typeError("Fecha inválida"),
//   fcIncurrenciaHasta: yup
//     .date()
//     .required(REQUERIDO)
//     .test(
//       "test fcincurrenciahasta",
//       "Fecha inválida - Debe ser mayor o igual a Fc.Incurrencia Desde",
//       (value, context) => {
//         const fcDdesde = context.parent.fcIncurrenciaDesde;
//         return getDaysBetweenDates(fcDdesde, value) >= 0;
//       }
//     )
//     .typeError("Fecha inválida"),
// });
export const v_nuevoSiniestro = yup.object().shape({
  cdCliente: yup.number().required(REQUERIDO),
  cdAseguradora: yup.number().required(REQUERIDO),
  cdSucursal: yup.number().required(REQUERIDO),
});

export const debounce = (func, delay) => {
  let timer;
  return function () {
    clearTimeout(timer);
    timer = setTimeout(() => func.apply(this, arguments), delay);
  };
};

export const backFormat = "DD/MM/YYYY";
export const formatFieldValue = (value) => moment(value).format(backFormat);

export const isVam = (value) => {
  const lowerRamo = value.toLowerCase();
  return lowerRamo.includes("vida") || lowerRamo.includes("medica");
};

export const customSortMethodDate = (a, b, desc) => {

  const dateA = new Date(
    parseInt(a.split("/")[2]),
    parseInt(a.split("/")[1]) - 1,
    parseInt(a.split("/")[0])
  );

  const dateB = new Date(
    parseInt(b.split("/")[2]),
    parseInt(b.split("/")[1]) - 1,
    parseInt(b.split("/")[0])
  );

  // Descartar null o undefined
  if (dateA === null || dateA === undefined) {
    //return desc ? 1 : -1;
    return -1;
  }

  if (dateB === null || dateB === undefined) {
    // return desc ? -1 : 1;
    return 1;
  }

  // Comparar fechas
  if (dateA > dateB) {
    return 1;
  }

  if (dateA < dateB) {
    return -1;
  }

  // Devolver 0 o undefined para usar cualquier método de ordenación adicional
  return 0;
};
