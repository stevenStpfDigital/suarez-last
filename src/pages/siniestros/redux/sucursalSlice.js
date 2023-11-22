import { createSlice } from "@reduxjs/toolkit";

export const sucursalSlice = createSlice({
  name: "ramos",
  initialState: {
    value: [],
  },
  reducers: {
    save_data_storage_sucursal: (state, action) => {
      state.value = action.payload;
    },
  },
});

// Action creators are generated for each case reducer function
export const { save_data_storage_sucursal } = sucursalSlice.actions;

export default sucursalSlice.reducer;
