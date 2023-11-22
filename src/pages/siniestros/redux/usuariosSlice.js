import { createSlice } from "@reduxjs/toolkit";

export const usuariosSlice = createSlice({
  name: "usuario",
  initialState: {
    value: [],
  },
  reducers: {
    save_data_storage_usuarios: (state, action) => {
      state.value = action.payload;
    },
  },
});

// Action creators are generated for each case reducer function
export const { save_data_storage_usuarios } = usuariosSlice.actions;

export default usuariosSlice.reducer;
