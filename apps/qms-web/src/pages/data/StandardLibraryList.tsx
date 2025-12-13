import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { useTranslation } from 'react-i18next';
import { PageHeader, Card, Button, FormInput, FormSelect, FormTextarea } from '@repo/ui'; // Assuming these exist
import { Plus, Search } from 'lucide-react';

const api = axios.create({ baseURL: 'http://localhost:3000' });

export default function StandardLibraryList() {
    const { t } = useTranslation();
    const queryClient = useQueryClient();
    const [newItem, setNewItem] = useState({ category: 'FAILURE_MODE', code: '', name: '', description: '' });
    const [filterCategory, setFilterCategory] = useState<string>('');

    const { data: items, isLoading } = useQuery({
        queryKey: ['standard-library', filterCategory],
        queryFn: async () => {
            const params = filterCategory ? { category: filterCategory } : {};
            const { data } = await api.get('/qms/standard-library', { params });
            return data;
        },
    });

    const createMutation = useMutation({
        mutationFn: (data: any) => api.post('/qms/standard-library', data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['standard-library'] });
            setNewItem({ category: 'FAILURE_MODE', code: '', name: '', description: '' });
        },
    });

    const handleCreate = (e: React.FormEvent) => {
        e.preventDefault();
        createMutation.mutate(newItem);
    };

    return (
        <div className="space-y-6">
            <PageHeader title="Standard Library" description="Manage reusable knowledge bank for FMEA" />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Creation Form */}
                <Card className="p-4 md:col-span-1 h-fit">
                    <h3 className="font-bold mb-4">Add New Standard Item</h3>
                    <form onSubmit={handleCreate} className="space-y-3">
                        <select
                            className="w-full border rounded p-2"
                            value={newItem.category}
                            onChange={e => setNewItem({ ...newItem, category: e.target.value })}
                        >
                            <option value="PROCESS">Process</option>
                            <option value="FAILURE_MODE">Failure Mode</option>
                            <option value="EFFECT">Effect</option>
                            <option value="CAUSE">Cause</option>
                            <option value="DETECTION">Detection</option>
                            <option value="PREVENTION">Prevention</option>
                        </select>
                        <input
                            placeholder="Code (e.g. FM-001)"
                            className="w-full border rounded p-2"
                            value={newItem.code}
                            onChange={e => setNewItem({ ...newItem, code: e.target.value })}
                            required
                        />
                        <input
                            placeholder="Name"
                            className="w-full border rounded p-2"
                            value={newItem.name}
                            onChange={e => setNewItem({ ...newItem, name: e.target.value })}
                            required
                        />
                        <textarea
                            placeholder="Description"
                            className="w-full border rounded p-2"
                            value={newItem.description}
                            onChange={e => setNewItem({ ...newItem, description: e.target.value })}
                        />
                        <Button type="submit" disabled={createMutation.isPending} className="w-full">
                            {createMutation.isPending ? 'Adding...' : 'Add Item'}
                        </Button>
                    </form>
                </Card>

                {/* List View */}
                <Card className="p-4 md:col-span-2">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="font-bold">Library Items</h3>
                        <div className="flex gap-2">
                            <select
                                className="border rounded p-1 text-sm"
                                value={filterCategory}
                                onChange={e => setFilterCategory(e.target.value)}
                            >
                                <option value="">All Categories</option>
                                <option value="PROCESS">Process</option>
                                <option value="FAILURE_MODE">Failure Mode</option>
                                <option value="EFFECT">Effect</option>
                                <option value="CAUSE">Cause</option>
                                <option value="DETECTION">Detection</option>
                                <option value="PREVENTION">Prevention</option>
                            </select>
                        </div>
                    </div>

                    {isLoading ? <div>Loading...</div> : (
                        <div className="space-y-2">
                            {items?.map((item: any) => (
                                <div key={item.id} className="border-b py-2 last:border-0">
                                    <div className="flex justify-between">
                                        <span className="font-semibold text-sm">{item.code} - {item.name}</span>
                                        <span className="text-xs bg-gray-100 px-2 py-0.5 rounded">{item.category}</span>
                                    </div>
                                    <p className="text-xs text-gray-500">{item.description}</p>
                                </div>
                            ))}
                            {items?.length === 0 && <div className="text-gray-400 text-sm text-center">No items found.</div>}
                        </div>
                    )}
                </Card>
            </div>
        </div>
    );
}
