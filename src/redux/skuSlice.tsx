import { createSlice } from "@reduxjs/toolkit"
import { skuDetails } from "../pages/SKU/SkuComp"

interface skuArrayState {
    skuArray: skuDetails[]
}

const initialState: skuArrayState = {
    skuArray: []
}

const skuArraySlice = createSlice({
    name: 'skuArray',
    initialState,
    reducers: {
        addSku: (state, action) => {
            state.skuArray.push(action.payload)
        },
        removeSku: (state, action) => {
            state.skuArray = state.skuArray.filter((sku) => sku.id !== action.payload)
        },
        updateSku: (state, action) => {
            state.skuArray = state.skuArray.map((sku) => sku.id === action.payload.id ? action.payload : sku)
        }
    }
})

export const { addSku, removeSku, updateSku } = skuArraySlice.actions
export default skuArraySlice.reducer