import { configureStore } from "@reduxjs/toolkit";
import counterReducer from "../features/counter/counterSlice";
import estSiniestrosReducer from "../pages/siniestros/redux/estSiniestrosSlice";
import aseguradorasReducer from "../pages/siniestros/redux/aseguradorasSlice"

export default configureStore({
  reducer: {
    counter: counterReducer,
    estSiniestros: estSiniestrosReducer,
    aseguradoras: aseguradorasReducer
  },
});
