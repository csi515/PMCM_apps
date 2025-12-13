import React from 'react';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { PageHeader, Button, Card, DataTable, Badge } from '@repo/ui';
import { Plus, Activity } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const api = axios.create({ baseURL: 'http://localhost:3000' });

export default function QualityIssueList() {
    const navigate = useNavigate();

    const { data: issues = [], isLoading } = useQuery({
        queryKey: ['quality-issues'],
        queryFn: async () => {
            const res = await api.get('/qms/quality-issues');
            return res.data;
        }
    });

    const columns = [
        { header: 'Issue No', accessorKey: 'issueNo' },
        { header: 'Title', accessorKey: 'title' },
        {
            header: 'Step',
            accessorKey: 'processStep',
            cell: (info: any) => <Badge variant="neutral">{info.getValue()}</Badge>
        },
        {
            header: 'Status',
            accessorKey: 'status',
            cell: (info: any) => {
                const status = info.getValue();
                const variant =
                    status === 'CLOSED' ? 'success' :
                        status === 'IN_PROGRESS' ? 'warning' : 'danger';
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
                title="Quality Issues (8D)"
                description="8D Problem Solving Reports"
                action={
                    <Button onClick={() => navigate('/issues/new')}>
                        <Plus className="w-4 h-4 mr-2" /> New 8D Report
                    </Button>
                }
            />

            <Card className="p-0">
                <DataTable
                    data={issues}
                    columns={columns}
                    isLoading={isLoading}
                    onRowClick={(row) => navigate(`/issues/${row.id}`)}
                />
            </Card>
        </div>
    );
}
