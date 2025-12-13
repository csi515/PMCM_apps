import React from 'react';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { PageHeader, Button, Card, DataTable, Badge } from '@repo/ui';
import { Plus, CheckSquare } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const api = axios.create({ baseURL: 'http://localhost:3000' });

export default function PpapList() {
    const navigate = useNavigate();

    const { data: ppapList = [], isLoading } = useQuery({
        queryKey: ['ppap'],
        queryFn: async () => {
            const res = await api.get('/qms/ppap');
            return res.data;
        }
    });

    const columns = [
        { header: 'Title', accessorKey: 'title' },
        { header: 'Customer', accessorKey: 'customer' },
        { header: 'Level', accessorKey: 'submissionLevel', cell: (info: any) => `Level ${info.getValue()}` },
        {
            header: 'Status',
            accessorKey: 'status',
            cell: (info: any) => {
                const status = info.getValue();
                const variant =
                    status === 'APPROVED' ? 'success' :
                        status === 'REJECTED' ? 'danger' :
                            status === 'SUBMITTED' ? 'warning' : 'neutral';
                return <Badge variant={variant}>{status}</Badge>;
            }
        },
        {
            header: 'Created At',
            accessorKey: 'createdAt',
            cell: (info: any) => new Date(info.getValue()).toLocaleDateString()
        }
    ];

    return (
        <div className="space-y-6">
            <PageHeader
                title="PPAP Management"
                description="Production Part Approval Process"
                action={
                    <Button onClick={() => navigate('/ppap/new')}>
                        <Plus className="w-4 h-4 mr-2" /> New Submission
                    </Button>
                }
            />

            <Card className="p-0">
                <DataTable
                    data={ppapList}
                    columns={columns}
                    isLoading={isLoading}
                    onRowClick={(row) => navigate(`/ppap/${row.id}`)}
                />
            </Card>
        </div>
    );
}
