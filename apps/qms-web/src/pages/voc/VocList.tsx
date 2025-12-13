import React from 'react';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios'; // Use configured api if available, or plain axios for now
import { useTranslation } from 'react-i18next';
import { PageHeader, Card, Button } from '@repo/ui'; // Assuming these exports exist
import { Plus } from 'lucide-react';

// Temporary API setup until we link the shared library properly
const api = axios.create({
    baseURL: 'http://localhost:3000', // Adjust port if needed
});

import { useNavigate } from 'react-router-dom';

export default function VocList() {
    const { t } = useTranslation();
    const navigate = useNavigate();

    const { data: vocs, isLoading } = useQuery({
        queryKey: ['vocs'],
        queryFn: async () => {
            const { data } = await api.get('/voc');
            return data;
        },
    });

    return (
        <div className="space-y-6">
            <PageHeader
                title={t('voc')}
                description="Manage customer complaints and inquiries"
            />

            <div className="flex justify-end">
                <Button onClick={() => navigate('/voc/new')}>
                    <Plus className="w-4 h-4 mr-2" />
                    New VOC
                </Button>
            </div>

            {isLoading ? (
                <div>Loading...</div>
            ) : (
                <div className="grid gap-4">
                    {vocs?.map((voc: any) => (
                        <Card key={voc.id} className="p-4 hover:shadow-md transition-shadow">
                            <div className="flex justify-between items-start">
                                <div>
                                    <h3 className="font-semibold text-lg">{voc.vocNo} - {voc.title}</h3>
                                    <p className="text-sm text-gray-500">{voc.customer} | {voc.product}</p>
                                </div>
                                <span className={`px-2 py-1 rounded text-xs font-bold ${voc.status === 'RECEIVED' ? 'bg-yellow-100 text-yellow-800' :
                                    voc.status === 'CLOSED' ? 'bg-green-100 text-green-800' : 'bg-gray-100'
                                    }`}>
                                    {voc.status}
                                </span>
                            </div>
                            <p className="mt-2 text-gray-700 clamp-2">{voc.description}</p>
                        </Card>
                    ))}
                    {vocs?.length === 0 && (
                        <div className="text-center text-gray-500 py-10">No VOCs found.</div>
                    )}
                </div>
            )}
        </div>
    );
}
