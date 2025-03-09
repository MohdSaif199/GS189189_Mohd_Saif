import { configureStore } from "@reduxjs/toolkit";
import storeArrayReducer from "./slice";
import skuArrayReducer from "./skuSlice";
import planningReducer from "./planningSlice";

export const store = configureStore({
    reducer: {
        storeArray: storeArrayReducer,
        skuArray: skuArrayReducer,
        planning: planningReducer
    }
})

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;