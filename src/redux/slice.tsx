import { createSlice } from "@reduxjs/toolkit"
import { storeDetails } from "../pages/Store/Store"

interface storeArrayState {
    storeArray: storeDetails[]
}

const initialState: storeArrayState = {
    storeArray: []
}

const storeArraySlice = createSlice({
    name: 'storeArray',
    initialState,
    reducers: {
        addStore: (state, action) => {
            state.storeArray.push(action.payload)
        },
        removeStore: (state, action) => {
            state.storeArray = state.storeArray.filter((store) => store.id !== action.payload)
        },
        updateStore: (state, action) => {
            state.storeArray = state.storeArray.map((store) => store.id === action.payload.id ? action.payload : store)
        }
    }
})

export const { addStore, removeStore, updateStore } = storeArraySlice.actions
export default storeArraySlice.reducer