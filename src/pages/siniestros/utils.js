function firstDayMonth() {
  let date = new Date(2000, 0, 1);
  // let date = new Date();
  // date.setFullYear(date.getFullYear() - 1);
  return date;
}

export const defaultNuevoSiniestroFilter = () => {
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
    cdUsuario: "%",
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
    fcRecepcion: firstDayMonth(),
    cdRamo: null,
    poliza: null,
    fcEvento: firstDayMonth(),
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
    cdAsegurado:null,
    cdDiagnostico:null
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


