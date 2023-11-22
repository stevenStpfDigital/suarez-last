import { configureStore } from "@reduxjs/toolkit";
import counterReducer from "../features/counter/counterSlice";
import estSiniestrosReducer from "../pages/siniestros/redux/estSiniestrosSlice";
import aseguradorasReducer from "../pages/siniestros/redux/aseguradorasSlice";
import ramosReducer from "../pages/siniestros/redux/ramosSlice";
import sucursalReducer from "../pages/siniestros/redux/sucursalSlice";
import usuarioReducer from "../pages/siniestros/redux/usuariosSlice";
export default configureStore({
  reducer: {
    counter: counterReducer,
    estSiniestros: estSiniestrosReducer,
    aseguradoras: aseguradorasReducer,
    ramos: ramosReducer,
    sucursal: sucursalReducer,
    usuario: usuarioReducer,
  },
});
