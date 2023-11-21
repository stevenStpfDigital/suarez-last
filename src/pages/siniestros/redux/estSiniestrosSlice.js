import { createSlice } from "@reduxjs/toolkit";

export const estSiniestroSlice = createSlice({
  name: "estSiniestros",
  initialState: {
    value: [],
  },
  reducers: {
    save_data_storage: (state, action) => {
      state.value = action.payload;
    },
  },
});

// Action creators are generated for each case reducer function
export const { save_data_storage } = estSiniestroSlice.actions;

export default estSiniestroSlice.reducer;
