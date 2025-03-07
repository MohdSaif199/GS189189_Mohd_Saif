import { configureStore } from "@reduxjs/toolkit";
import storeArrayReducer from "./slice";

export const store = configureStore({
    reducer:{
        storeArray: storeArrayReducer
    }
})

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;