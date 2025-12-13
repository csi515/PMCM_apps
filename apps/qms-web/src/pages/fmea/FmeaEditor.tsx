import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { useTranslation } from 'react-i18next';
import { PageHeader, Card, Button, FormInput } from '@repo/ui';
import { Save, ArrowLeft, Plus } from 'lucide-react';

const api = axios.create({ baseURL: 'http://localhost:3000' });

export default function FmeaEditor() {
    const { id } = useParams();
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const isNew = !id || id === 'new';

    const [formData, setFormData] = useState({
        fmeaNo: '',
        title: '',
        partName: '',
        partNumber: '',
        revision: '1',
        items: [] as any[]
    });

    const { data: fmea } = useQuery({
        queryKey: ['fmea', id],
        queryFn: async () => {
            if (isNew) return null;
            const res = await api.get(`/qms/fmea/${id}`);
            return res.data;
        },
        enabled: !isNew
    });

    useEffect(() => {
        if (fmea) {
            setFormData({
                fmeaNo: fmea.fmeaNo,
                title: fmea.title,
                partName: fmea.partName,
                partNumber: fmea.partNumber,
                revision: fmea.revision,
                items: fmea.items || []
            });
        }
    }, [fmea]);

    const mutation = useMutation({
        mutationFn: (data: any) => {
            if (isNew) return api.post('/qms/fmea', data);
            return api.put(`/qms/fmea/${id}`, data);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['fmeas'] });
            navigate('/fmea');
        }
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        mutation.mutate(formData);
    };

    return (
        <div className="space-y-6">
            <PageHeader
                title={isNew ? "New FMEA" : `Edit FMEA: ${formData.fmeaNo}`}
                description="Process Failure Mode and Effects Analysis"
                action={
                    <div className="flex gap-2">
                        <Button variant="secondary" onClick={() => navigate('/fmea')}>
                            <ArrowLeft className="w-4 h-4 mr-2" /> Back
                        </Button>
                        <Button onClick={handleSubmit} disabled={mutation.isPending}>
                            <Save className="w-4 h-4 mr-2" /> Save
                        </Button>
                    </div>
                }
            />

            <form onSubmit={handleSubmit} className="space-y-6">
                <Card className="p-6">
                    <h3 className="font-bold mb-4 text-lg">Header Information</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        <FormInput
                            label="FMEA Number"
                            name="fmeaNo"
                            value={formData.fmeaNo}
                            onChange={(e: any) => setFormData({ ...formData, fmeaNo: e.target.value })}
                            required
                        />
                        <FormInput
                            label="Title"
                            name="title"
                            value={formData.title}
                            onChange={(e: any) => setFormData({ ...formData, title: e.target.value })}
                            required
                        />
                        <FormInput
                            label="Part Name"
                            name="partName"
                            value={formData.partName}
                            onChange={(e: any) => setFormData({ ...formData, partName: e.target.value })}
                            required
                        />
                        <FormInput
                            label="Part Number"
                            name="partNumber"
                            value={formData.partNumber}
                            onChange={(e: any) => setFormData({ ...formData, partNumber: e.target.value })}
                            required
                        />
                        <FormInput
                            label="Revision"
                            name="revision"
                            value={formData.revision}
                            onChange={(e: any) => setFormData({ ...formData, revision: e.target.value })}
                        />
                    </div>
                </Card>

                <Card className="p-6">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="font-bold text-lg">Process Items</h3>
                        <Button type="button" variant="secondary" size="sm">
                            <Plus className="w-4 h-4 mr-2" /> Add Item
                        </Button>
                    </div>

                    <div className="overflow-x-auto border rounded">
                        <table className="w-full text-sm text-left">
                            <thead className="bg-gray-50 text-gray-700 uppercase">
                                <tr>
                                    <th className="px-4 py-3">Process Step</th>
                                    <th className="px-4 py-3">Failure Mode</th>
                                    <th className="px-4 py-3">Effect</th>
                                    <th className="px-4 py-3">Cause</th>
                                    <th className="px-4 py-3 w-16">S</th>
                                    <th className="px-4 py-3 w-16">O</th>
                                    <th className="px-4 py-3 w-16">D</th>
                                    <th className="px-4 py-3 w-16">RPN</th>
                                    <th className="px-4 py-3 w-10"></th>
                                </tr>
                            </thead>
                            <tbody>
                                {formData.items.length === 0 && (
                                    <tr>
                                        <td colSpan={9} className="px-4 py-8 text-center text-gray-400">
                                            No items added yet. Click "Add Item" to start.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </Card>
            </form>
        </div>
    );
}
