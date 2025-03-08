import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux';
import { storeDetails } from '../Store/Store';
import { skuDetails } from '../SKU/SkuComp';
import { AgGridReact } from 'ag-grid-react';
import { AllCommunityModule, ModuleRegistry } from 'ag-grid-community';

export interface PlanningDetails {
    store: string;
    sku: string;
    price: number;
    cost: number;
    salesUnits: { [week: string]: number };
}

ModuleRegistry.registerModules([AllCommunityModule]);

const weeks = ["Week 1", "Week 2", "Week 3", "Week 4"];
const month = "Feb"; // Example month name
const Planning = () => {
    const skuArray = useSelector((state: any) => state.skuArray.skuArray)
    const storeArray = useSelector((state: any) => state.storeArray.storeArray)
    const [rowData, setRowData] = useState<PlanningDetails[]>([]);
    const [columnDefs, setColumnDefs] = useState<any[]>([]);

    useEffect(() => {
        // Generate row data dynamically using flatMap to find the cross join of the two arrays
        const generatedRows = storeArray.flatMap((store: storeDetails) =>
            skuArray.map((sku: skuDetails) => ({
                store: store.storeName,
                sku: sku.skuName,
                price: sku.price,
                cost: sku.cost,
                salesUnits: weeks.reduce((acc, week) => ({ ...acc, [week]: 0 }), {})
            }))
        );
        setRowData(generatedRows);

        // Generate column definitions dynamically
        const cols = [
            { field: "store", headerName: "Store", pinned: "left" },
            { field: "sku", headerName: "SKU", pinned: "left" },
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
                                // Parse and ensure value is not negative
                                const parsedValue = parseInt(params.newValue, 10);
                                return isNaN(parsedValue) || parsedValue < 0 ? 0 : parsedValue;
                            }
                        },
                        {
                            headerName: "Sales Dollars",
                            valueGetter: (params: any) =>
                                params.data.salesUnits[week] * params.data.price,
                            valueFormatter: (params: any): string =>
                                `$${params.value.toFixed(2)}`
                        },
                        {
                            headerName: "GM Dollars",
                            valueGetter: (params: any) =>
                                (params.data.salesUnits[week] * params.data.price) -
                                (params.data.salesUnits[week] * params.data.cost),
                            valueFormatter: (params: any): string =>
                                `$${params.value.toFixed(2)}`
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
                            // For formatting the color according to percentage
                            cellStyle: (params: any) => {
                                if (params.value >= 0.4)
                                    return { backgroundColor: "green", color: "white" };
                                if (params.value >= 0.1)
                                    return { backgroundColor: "yellow", color: "black" };
                                if (params.value > 0.05)
                                    return { backgroundColor: "orange", color: "black" };
                                return { backgroundColor: "red", color: "white" };
                            }
                        }
                    ]
                }))
            }
        ];
        setColumnDefs(cols);
    }, []);

    return (
        <div style={{ height: "650px", width: "100%" }}>
            <AgGridReact rowData={rowData} columnDefs={columnDefs} />
        </div>
    )
}

export default Planning
