import { createSlice } from "@reduxjs/toolkit";

export const aseguradorasSlice = createSlice({
  name: "aseguradoras",
  initialState: {
    value: [],
  },
  reducers: {
    save_data_storage_aseguradoras: (state, action) => {
      state.value = action.payload;
    },
  },
});

// Action creators are generated for each case reducer function
export const { save_data_storage_aseguradoras } = aseguradorasSlice.actions;

export default aseguradorasSlice.reducer;
