import React, { useEffect, useState, useMemo } from "react";
import { useSelector, useDispatch } from "react-redux";
import { storeDetails } from "../Store/Store";
import { skuDetails } from "../SKU/SkuComp";
import { AgGridReact } from "ag-grid-react";
import { AllCommunityModule, ModuleRegistry } from "ag-grid-community";
import { setPlanningData } from "../../redux/planningSlice";

export interface PlanningDetails {
    store: string;
    sku: string;
    price: number;
    cost: number;
    salesUnits: { [week: string]: number };
}

ModuleRegistry.registerModules([AllCommunityModule]);

const weeks = ["Week 1", "Week 2", "Week 3", "Week 4"];
const month = "Feb";

const Planning = () => {
    const dispatch = useDispatch();
    const storedRowData = useSelector((state: any) => state.planning.rowData);

    const skuArray = useSelector((state: any) => state.skuArray.skuArray);
    const storeArray = useSelector((state: any) => state.storeArray.storeArray);
    const [rowData, setRowData] = useState<PlanningDetails[]>(() => storedRowData.length ? storedRowData : []);

    const [columnDefs, setColumnDefs] = useState<any[]>([]);

    const generatedRows = useMemo(() => {
        // Create a Map for faster look
        const storedMap = new Map<string, PlanningDetails>(
            storedRowData.map((row: PlanningDetails) => [`${row.store}-${row.sku}`, row])
        );

        // Generate rows for all combinations of stores and SKUs
        const updatedRows = storeArray.flatMap((store: storeDetails) =>
            skuArray.map((sku: skuDetails) => {
                const key = `${store.storeName}-${sku.skuName}`;
                const existingData = storedMap.get(key);

                return {
                    store: store.storeName,
                    sku: sku.skuName,
                    price: sku.price,
                    cost: sku.cost,
                    salesUnits: existingData
                        ? { ...existingData.salesUnits } // Keep existing salesUnits if available
                        : weeks.reduce((acc, week) => ({ ...acc, [week]: 0 }), {}), // Default salesUnits
                };
            })
        );

        return updatedRows;
    }, [storeArray, skuArray, storedRowData]);


    const newCols = useMemo(() => {
        return [
            { field: "store", headerName: "Store", pinned: "left" as "left" },
            { field: "sku", headerName: "SKU", pinned: "left" as "left" },
            {
                headerName: month,
                children: weeks.map((week) => ({
                    headerName: week,
                    children: [
                        {
                            field: `salesUnits.${week}`,
                            headerName: "Sales Units",
                            editable: true,
                            sortable: true,
                            valueParser: (params: any) => {
                                const parsedValue = parseInt(params.newValue, 10);
                                return isNaN(parsedValue) || parsedValue < 0 ? 0 : parsedValue;
                            },
                            valueSetter: (params: any) => {
                                const newValue = parseInt(params.newValue, 10);
                                if (isNaN(newValue) || newValue < 0) return false; // Prevent invalid values

                                setRowData((prevRowData) => {
                                    const updatedRows = prevRowData.map((row) =>
                                        row.store === params.data.store && row.sku === params.data.sku
                                            ? {
                                                ...row,
                                                salesUnits: { ...row.salesUnits, [week]: newValue },
                                            }
                                            : row
                                    );
                                    dispatch(setPlanningData(updatedRows));
                                    return updatedRows;
                                });
                                return true; // Value was set successfully
                            },
                        }
                        ,
                        {
                            headerName: "Sales Dollars",
                            valueGetter: (params: any) =>
                                params.data.salesUnits[week] * params.data.price,
                            valueFormatter: (params: any): string =>
                                `$${params.value.toFixed(2)}`,
                        },
                        {
                            headerName: "GM Dollars",
                            valueGetter: (params: any) =>
                                params.data.salesUnits[week] * params.data.price -
                                params.data.salesUnits[week] * params.data.cost,
                            valueFormatter: (params: any): string =>
                                `$${params.value.toFixed(2)}`,
                        },
                        {
                            headerName: "GM Percent",
                            valueGetter: (params: any) => {
                                const salesDollars =
                                    params.data.salesUnits[week] * params.data.price;
                                const gmDollars =
                                    salesDollars - params.data.salesUnits[week] * params.data.cost;
                                return salesDollars ? gmDollars / salesDollars : 0;
                            },
                            valueFormatter: (params: any): string =>
                                `${(params.value * 100).toFixed(2)}%`,
                            cellStyle: (params: any) => {
                                if (params.value >= 0.4)
                                    return { backgroundColor: "green", color: "white" };
                                if (params.value >= 0.1)
                                    return { backgroundColor: "yellow", color: "black" };
                                if (params.value > 0.05)
                                    return { backgroundColor: "orange", color: "black" };
                                return { backgroundColor: "red", color: "white" };
                            },
                        },
                    ],
                })),
            },
        ];
    }, []);

    useEffect(() => {
        // Merge storedRowData with newly added SKUs/stores
        const mergedRowData = generatedRows.map((newRow: PlanningDetails) => {
            const existingRow = storedRowData.find(
                (storedRow: PlanningDetails) => storedRow.store === newRow.store && storedRow.sku === newRow.sku
            );
            return existingRow ? { ...newRow, salesUnits: existingRow.salesUnits } : newRow;
        });

        // Update rowData only if there is a change
        if (JSON.stringify(mergedRowData) !== JSON.stringify(rowData)) {
            setRowData(mergedRowData);
            dispatch(setPlanningData(mergedRowData));
        }

        // Set column definitions only once
        if (!columnDefs.length) {
            setColumnDefs(newCols);
        }
    }, [generatedRows, storedRowData, dispatch]);



    return (
        <div style={{ height: "650px", width: "100%" }}>
            <AgGridReact rowData={rowData} columnDefs={columnDefs} />
        </div>
    );
};

export default Planning;