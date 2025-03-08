import { configureStore } from "@reduxjs/toolkit";
import storeArrayReducer from "./slice";
import skuArrayReducer from "./skuSlice";

export const store = configureStore({
    reducer: {
        storeArray: storeArrayReducer,
        skuArray: skuArrayReducer,
    }
})

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;