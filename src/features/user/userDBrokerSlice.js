import { createSlice } from "@reduxjs/toolkit";

export const userDBrokerSlice = createSlice({
  name: "usuarioDbroker",
  initialState: {
    value: {},
  },
  reducers: {
    save_data_storage_usuariosDBroker: (state, action) => {
      state.value = action.payload;
    },
  },
});

// Action creators are generated for each case reducer function
export const { save_data_storage_usuariosDBroker } = userDBrokerSlice.actions;

export default userDBrokerSlice.reducer;
