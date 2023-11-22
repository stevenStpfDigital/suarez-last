import { createSlice } from "@reduxjs/toolkit";

export const ramosSlice = createSlice({
  name: "ramos",
  initialState: {
    value: [],
  },
  reducers: {
    save_data_storage_ramos: (state, action) => {
      state.value = action.payload;
    },
  },
});

// Action creators are generated for each case reducer function
export const { save_data_storage_ramos } = ramosSlice.actions;

export default ramosSlice.reducer;
