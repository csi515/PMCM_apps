import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../lib/api';
import { User } from '../types';

async function fetchUsers() {
    const { data } = await api.get<User[]>('/users');
    return data;
}

export function useUsers() {
    return useQuery({
        queryKey: ['users'],
        queryFn: fetchUsers,
    });
}

// Example Mutation
/*
export function useCreateUser() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (newUser: User) => api.post('/users', newUser),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
  });
}
*/
