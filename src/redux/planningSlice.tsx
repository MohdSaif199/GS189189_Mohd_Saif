import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface PlanningDetails {
  store: string;
  sku: string;
  price: number;
  cost: number;
  salesUnits: { [week: string]: number };
}

interface PlanningState {
  rowData: PlanningDetails[];
}

const initialState: PlanningState = {
  rowData: [],
};

const planningSlice = createSlice({
  name: "planning",
  initialState,
  reducers: {
    setPlanningData: (state, action: PayloadAction<PlanningDetails[]>) => {
      state.rowData = action.payload;
    },
  },
});

export const { setPlanningData } = planningSlice.actions;
export default planningSlice.reducer;
