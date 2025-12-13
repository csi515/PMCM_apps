import React from 'react';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { Badge } from '@repo/ui';
import { Clock, User as UserIcon } from 'lucide-react';

const api = axios.create({ baseURL: 'http://localhost:3000' });

interface AuditLogViewerProps {
    entityId: string | number;
    entityType: string;
}

export default function AuditLogViewer({ entityId, entityType }: AuditLogViewerProps) {
    const { data: logs = [], isLoading } = useQuery({
        queryKey: ['audit', entityType, entityId],
        queryFn: async () => {
            const res = await api.get(`/qms/audit?entityId=${entityId}&entityType=${entityType}`);
            return res.data;
        }
    });

    if (isLoading) return <div className="text-sm text-gray-500">Loading history...</div>;

    if (logs.length === 0) {
        return <div className="text-sm text-gray-400 italic">No history found.</div>;
    }

    return (
        <div className="space-y-4">
            <h3 className="font-semibold text-gray-900 flex items-center">
                <Clock className="w-4 h-4 mr-2" /> Activity History
            </h3>
            <div className="relative border-l-2 border-gray-200 ml-2 space-y-6">
                {logs.map((log: any) => (
                    <div key={log.id} className="ml-6 relative">
                        <div className="absolute -left-[31px] bg-white border-2 border-gray-200 rounded-full w-4 h-4 mt-1.5"></div>
                        <div className="bg-white p-3 rounded-lg border shadow-sm">
                            <div className="flex justify-between items-start">
                                <div>
                                    <span className="font-medium text-gray-900 capitalize">{log.action.replace('_', ' ')}</span>
                                    <div className="text-xs text-gray-500 mt-1 flex items-center">
                                        <UserIcon className="w-3 h-3 mr-1" /> User #{log.userId}
                                    </div>
                                </div>
                                <span className="text-xs text-gray-400">
                                    {new Date(log.createdAt).toLocaleString()}
                                </span>
                            </div>
                            {log.details && Object.keys(log.details).length > 0 && (
                                <div className="mt-2 text-xs bg-gray-50 p-2 rounded text-gray-600 font-mono">
                                    {JSON.stringify(log.details, null, 2)}
                                </div>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
