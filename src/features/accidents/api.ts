import type { UseMutationResult, UseQueryResult } from "@tanstack/react-query";
// eslint-disable-next-line no-duplicate-imports
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from '@tanstack/react-router';
import apiClient from '../../lib/axios';
import type { Accident } from './types';

const getAccidents = async (): Promise<Array<Accident>> => {
	const response = await apiClient.get('/accidents');
	return response.data as Array<Accident>;
}

const getAccidentById = async (id: string): Promise<Accident> => {
	const response = await apiClient.get(`/accidents/${id}`);
	return response.data as Accident;
}

const createAccident = async (newAccident: Omit<Accident, 'id'>): Promise<Accident> => {
	const response = await apiClient.post('/accidents', newAccident);
	return response.data as Accident;
}

const updateAccident = async ({ id, data }: { id: string, data: Partial<Accident> }): Promise<Accident> => {
	const response = await apiClient.patch(`/accidents/${id}`, data);
	return response.data as Accident;
}

const deleteAccident = async (id: string): Promise<void> => {
	await apiClient.delete(`/accidents/${id}`);
}

export const useAccidents = (): UseQueryResult<Array<Accident>, Error> => useQuery<Array<Accident>>({ queryKey: ['accidents'], queryFn: getAccidents });

export const useAccident = (id: string): UseQueryResult<Accident, Error> => useQuery<Accident>({ queryKey: ['accidents', id], queryFn: () => getAccidentById(id) });

export const useCreateAccident = (): UseMutationResult<Accident, Error, Omit<Accident, "id">, unknown> => {
	const queryClient = useQueryClient();
	const navigate = useNavigate();

	return useMutation({
		mutationFn: createAccident,
		onSuccess: async () => {
			await queryClient.invalidateQueries({ queryKey: ['accidents'] });
			await navigate({ to: '/accidents' });
		},
	});
};

export const useUpdateAccident = (): UseMutationResult<Accident, Error, { id: string, data: Partial<Accident> }, unknown> => {
	const queryClient = useQueryClient();
	const navigate = useNavigate();

	return useMutation({
		mutationFn: updateAccident,
		onSuccess: async (updatedAccident) => {
			await queryClient.invalidateQueries({ queryKey: ['accidents'] });
			queryClient.setQueryData(['accidents', updatedAccident.id], updatedAccident);
			await navigate({ to: '/accidents' });
		},
	});
};

export const useDeleteAccident = (): UseMutationResult<void, Error, string, unknown> => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: deleteAccident,
		onSuccess: async () => {
			await queryClient.invalidateQueries({ queryKey: ['accidents'] });
		}
	})
}