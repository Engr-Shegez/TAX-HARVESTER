import { configureStore } from "@reduxjs/toolkit";
import harvesterReducer from "../features/harvester/store/harvesterSlice";

export const store = configureStore({
  reducer: {
    harvester: harvesterReducer,
  },
});
