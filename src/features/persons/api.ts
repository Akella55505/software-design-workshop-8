import type { UseMutationResult, UseQueryResult } from "@tanstack/react-query";
// eslint-disable-next-line no-duplicate-imports
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from '@tanstack/react-router';
import apiClient from '../../lib/axios';
import type { Person } from './types';

const getPersons = async (): Promise<Array<Person>> => {
	const response = await apiClient.get('/persons');
	return response.data as Array<Person>;
}

const getPersonById = async (id: string): Promise<Person> => {
	const response = await apiClient.get(`/persons/${id}`);
	return response.data as Person;
}

const createPerson = async (newPerson: Omit<Person, 'id'>): Promise<Person> => {
	const response = await apiClient.post('/persons', newPerson);
	return response.data as Person;
}

const updatePerson = async ({ id, data }: { id: string, data: Partial<Person> }): Promise<Person> => {
	const response = await apiClient.patch(`/persons/${id}`, data);
	return response.data as Person;
}

const deletePerson = async (id: string): Promise<void> => {
	await apiClient.delete(`/persons/${id}`);
}

export const usePersons = (): UseQueryResult<Array<Person>, Error> => useQuery<Array<Person>>({ queryKey: ['persons'], queryFn: getPersons });

export const usePerson = (id: string): UseQueryResult<Person, Error> => useQuery<Person>({ queryKey: ['persons', id], queryFn: () => getPersonById(id) });

export const useCreatePerson = (): UseMutationResult<Person, Error, Omit<Person, "id">, unknown> => {
	const queryClient = useQueryClient();
	const navigate = useNavigate();

	return useMutation({
		mutationFn: createPerson,
		onSuccess: async () => {
			await queryClient.invalidateQueries({ queryKey: ['persons'] });
			await navigate({ to: '/persons' });
		},
	});
};

export const useUpdatePerson = (): UseMutationResult<Person, Error, { id: string, data: Partial<Person> }, unknown> => {
	const queryClient = useQueryClient();
	const navigate = useNavigate();

	return useMutation({
		mutationFn: updatePerson,
		onSuccess: async (updatedPerson) => {
			await queryClient.invalidateQueries({ queryKey: ['persons'] });
			queryClient.setQueryData(['persons', updatedPerson.id], updatedPerson);
			await navigate({ to: '/persons' });
		},
	});
};

export const useDeletePerson = (): UseMutationResult<void, Error, string, unknown> => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: deletePerson,
		onSuccess: async () => {
			await queryClient.invalidateQueries({ queryKey: ['persons'] });
		}
	})
}