import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { PageHeader, Card, Button, FormInput, FormSelect, Badge } from '@repo/ui';
import { Plus, BarChart2 } from 'lucide-react';
import ControlChart from '../../components/Charts/ControlChart';

const api = axios.create({ baseURL: 'http://localhost:3000' });

export default function SpcDashboard() {
    const queryClient = useQueryClient();
    const [selectedChartId, setSelectedChartId] = useState<number | null>(null);
    const [inputValue, setInputValue] = useState('');

    const { data: charts = [], isLoading: chartsLoading } = useQuery({
        queryKey: ['spc-charts'],
        queryFn: async () => {
            const res = await api.get('/qms/spc/charts');
            return res.data;
        }
    });

    const { data: selectedChart, isLoading: chartLoading } = useQuery({
        queryKey: ['spc-chart', selectedChartId],
        queryFn: async () => {
            if (!selectedChartId) return null;
            const res = await api.get(`/qms/spc/charts/${selectedChartId}`);
            return res.data;
        },
        enabled: !!selectedChartId
    });

    const addDataMutation = useMutation({
        mutationFn: (value: number) => api.post(`/qms/spc/charts/${selectedChartId}/data`, { value }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['spc-chart', selectedChartId] });
            setInputValue('');
        }
    });

    const createChartMutation = useMutation({
        mutationFn: () => api.post('/qms/spc/charts', {
            code: `SPC-${Date.now()}`,
            title: 'New Control Chart',
            nominal: 10.0,
            usl: 10.5,
            lsl: 9.5
        }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['spc-charts'] });
        }
    });

    return (
        <div className="space-y-6">
            <PageHeader
                title="SPC Visualization"
                description="Holographic Data Visualization (Control Charts)"
                action={
                    <Button onClick={() => createChartMutation.mutate()}>
                        <Plus className="w-4 h-4 mr-2" /> New Chart Simulation
                    </Button>
                }
            />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* List of Charts */}
                <Card className="col-span-1 border-r pr-4">
                    <h3 className="font-semibold mb-4 flex items-center">
                        <BarChart2 className="w-4 h-4 mr-2" /> Active Charts
                    </h3>
                    <div className="space-y-2">
                        {charts.map((chart: any) => (
                            <div
                                key={chart.id}
                                onClick={() => setSelectedChartId(chart.id)}
                                className={`p-3 rounded cursor-pointer transition-colors ${selectedChartId === chart.id
                                        ? 'bg-brand-50 border-brand-200 border text-brand-700'
                                        : 'hover:bg-gray-50 border border-transparent'
                                    }`}
                            >
                                <div className="font-medium">{chart.title}</div>
                                <div className="text-xs text-gray-500">{chart.code}</div>
                            </div>
                        ))}
                        {charts.length === 0 && <div className="text-sm text-gray-500 italic">No charts found. Create one!</div>}
                    </div>
                </Card>

                {/* Chart View */}
                <Card className="col-span-1 md:col-span-2 min-h-[500px]">
                    {selectedChart ? (
                        <div className="space-y-6">
                            <div className="flex justify-between items-center">
                                <h2 className="text-xl font-bold">{selectedChart.title}</h2>
                                <Badge variant="neutral">{selectedChart.code}</Badge>
                            </div>

                            <div className="bg-white p-4 h-[400px]">
                                <ControlChart
                                    title={`${selectedChart.title} (X-Bar)`}
                                    dataPoints={selectedChart.dataPoints?.map((d: any) => d.value) || []}
                                    labels={selectedChart.dataPoints?.map((d: any) => new Date(d.measuredAt).toLocaleTimeString()) || []}
                                    nominal={selectedChart.nominal}
                                    usl={selectedChart.usl}
                                    lsl={selectedChart.lsl}
                                />
                            </div>

                            {/* Data Entry Simulator */}
                            <div className="flex items-end gap-4 p-4 bg-gray-50 rounded-lg">
                                <FormInput
                                    label="Add Measurement"
                                    type="number"
                                    step="0.01"
                                    value={inputValue}
                                    onChange={(e: any) => setInputValue(e.target.value)}
                                    placeholder="Enter value..."
                                />
                                <Button
                                    onClick={() => addDataMutation.mutate(Number(inputValue))}
                                    disabled={!inputValue || addDataMutation.isPending}
                                >
                                    Add Point
                                </Button>
                            </div>
                        </div>
                    ) : (
                        <div className="h-full flex flex-col items-center justify-center text-gray-400">
                            <BarChart2 className="w-16 h-16 mb-4 opacity-50" />
                            <p>Select a chart to view details</p>
                        </div>
                    )}
                </Card>
            </div>
        </div>
    );
}
