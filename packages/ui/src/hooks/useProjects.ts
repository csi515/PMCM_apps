import { useQuery } from '@tanstack/react-query';
import { api } from '../lib/api';
import { Project } from '../types';

// Assuming Project type is compatible or mapped
async function fetchProjects() {
    const { data } = await api.get<Project[]>('/projects');
    return data;
}

export function useProjects() {
    return useQuery({
        queryKey: ['projects'],
        queryFn: fetchProjects,
    });
}
