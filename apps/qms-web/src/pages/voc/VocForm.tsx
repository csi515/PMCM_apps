import React from 'react';
import { useForm } from 'react-hook-form';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { Button, FormInput, FormTextarea, FormSelect, Card } from '@repo/ui'; // Assuming these exist
import { useNavigate } from 'react-router-dom';

const api = axios.create({ baseURL: 'http://localhost:3000' });

export default function VocForm() {
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const { register, handleSubmit, formState: { errors } } = useForm();

    const mutation = useMutation({
        mutationFn: (newVoc: any) => api.post('/voc', newVoc),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['vocs'] });
            navigate('/voc');
        },
    });

    const onSubmit = (data: any) => {
        mutation.mutate(data);
    };

    return (
        <Card className="max-w-2xl mx-auto p-6">
            <h2 className="text-xl font-bold mb-4">Register New VOC</h2>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <FormInput
                    label="Title"
                    {...register('title', { required: 'Title is required' })}
                    error={errors.title?.message as string}
                />

                <div className="grid grid-cols-2 gap-4">
                    <FormInput
                        label="Customer"
                        {...register('customer', { required: 'Customer is required' })}
                        error={errors.customer?.message as string}
                    />
                    <FormInput
                        label="Product"
                        {...register('product')}
                    />
                </div>

                <FormSelect
                    label="Type"
                    options={[
                        { label: 'Complaint', value: 'COMPLAINT' },
                        { label: 'Inquiry', value: 'INQUIRY' },
                        { label: 'Suggestion', value: 'SUGGESTION' },
                    ]}
                    {...register('type', { required: 'Type is required' })}
                    error={errors.type?.message as string}
                />

                <FormTextarea
                    label="Description"
                    rows={4}
                    {...register('description')}
                />

                <div className="flex justify-end gap-2 pt-4">
                    <Button variant="outline" onClick={() => navigate('/voc')}>Cancel</Button>
                    <Button type="submit" disabled={mutation.isPending}>
                        {mutation.isPending ? 'Saving...' : 'Register VOC'}
                    </Button>
                </div>
            </form>
        </Card>
    );
}
