import React, { useMemo } from 'react'
import "./Chart.css"
import { Form, Tooltip } from 'react-bootstrap'
import { useSelector } from 'react-redux';
import { storeDetails } from '../Store/Store';
import { Bar, CartesianGrid, ComposedChart, Legend, Line, ResponsiveContainer, XAxis, YAxis } from 'recharts';
import { PlanningDetails } from '../Planning/Planning';

const Chart = () => {
    const storeArray = useSelector((state: any) => state.storeArray.storeArray);
    const planningArray = useSelector((state: any) => state.planning.rowData);
    const [selectedStore, setSelectedStore] = React.useState<string>(storeArray[0]?.storeName || "")

    const processedData = useMemo(() => {
        const weeklyData: Record<string, { week: string; salesDollars: number; gmDollars: number; gmPercentage?: number }> = {};

        planningArray
            .filter((item: PlanningDetails) => item.store === selectedStore)
            .forEach(({ price, cost, salesUnits }: PlanningDetails) => {
                Object.entries(salesUnits).forEach(([week, units]) => {
                    if (!weeklyData[week]) {
                        weeklyData[week] = { week, salesDollars: 0, gmDollars: 0 };
                    }
                    const salesDollars = units * price;
                    const gmDollars = salesDollars - units * cost;
                    weeklyData[week].salesDollars += salesDollars;
                    weeklyData[week].gmDollars += gmDollars;
                });
            });

        return Object.values(weeklyData).map((week) => ({
            ...week,
            gmPercentage: week.salesDollars ? (week.gmDollars / week.salesDollars) * 100 : 0
        }));
    }, [selectedStore]);

    return (
        <div className='chart-container'>
            <Form.Select className='w-50' onChange={(e) => {
                setSelectedStore((e.target as HTMLSelectElement).value)
            }}>
                {storeArray.map((store: storeDetails) => (
                    <option key={store.storeName} value={store.storeName} >{store.storeName}</option>
                ))}
            </Form.Select>
            <ResponsiveContainer width="100%" height={400} className="mt-5">
                <ComposedChart data={processedData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="week" />
                    <YAxis yAxisId="left" orientation="left" stroke="#8884d8" />
                    <YAxis yAxisId="right" orientation="right" stroke="#82ca9d" domain={[0, 100]} />
                    <Tooltip />
                    <Legend />
                    <Bar yAxisId="left" dataKey="gmDollars" fill="#8884d8" name="GM Dollars" />
                    <Line yAxisId="right" dataKey="gmPercentage" stroke="#ff7300" name="GM %" />
                </ComposedChart>
            </ResponsiveContainer>
        </div>
    )
}

export default Chart
