import React from 'react';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { useTranslation } from 'react-i18next';
import { PageHeader, Card, Button } from '@repo/ui';
import { Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const api = axios.create({ baseURL: 'http://localhost:3000' });

export default function FmeaList() {
    const { t } = useTranslation();
    const navigate = useNavigate();

    const { data: fmeas, isLoading } = useQuery({
        queryKey: ['fmeas'],
        queryFn: async () => {
            const { data } = await api.get('/qms/fmea');
            return data;
        },
    });

    return (
        <div className="space-y-6">
            <PageHeader title="FMEA Management" description="Failure Mode and Effects Analysis" />

            <div className="flex justify-end">
                <Button onClick={() => navigate('/fmea/new')}> // We will implement the new page later or reuse editor
                    <Plus className="w-4 h-4 mr-2" />
                    New FMEA
                </Button>
            </div>

            {isLoading ? <div>Loading...</div> : (
                <div className="grid gap-4">
                    {fmeas?.map((fmea: any) => (
                        <Card key={fmea.id} className="p-4 hover:shadow-md transition-shadow cursor-pointer" onClick={() => navigate(`/fmea/${fmea.id}`)}>
                            <div className="flex justify-between items-start">
                                <div>
                                    <h3 className="font-semibold text-lg">{fmea.fmeaNo} - {fmea.title}</h3>
                                    <p className="text-sm text-gray-500">{fmea.partName} ({fmea.partNumber})</p>
                                </div>
                                <span className="px-2 py-1 rounded text-xs font-bold bg-blue-100 text-blue-800">
                                    {fmea.revision}
                                </span>
                            </div>
                            <p className="mt-2 text-sm text-gray-400">Items: {fmea.items?.length || 0}</p>
                        </Card>
                    ))}
                    {fmeas?.length === 0 && <div className="text-center text-gray-500 py-10">No FMEAs found.</div>}
                </div>
            )}
        </div>
    );
}
