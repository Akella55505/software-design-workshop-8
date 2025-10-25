import { useParams } from '@tanstack/react-router';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { usePerson, useUpdatePerson } from '../api';
import { type ReactElement, useEffect } from "react";
import type { Person } from "../types.ts";

const personSchema = z.object({
	name: z.string().min(2, "Name is too short"),
	surname: z.string().min(2, 'Surname is too short'),
	patronymic: z.string().min(2, 'Patronymic is too short'),
});

type PersonResponse = {
	message: string;
	data: Person;
}

type PersonFormData = z.infer<typeof personSchema>;

export function PersonDetailPage(): ReactElement {
	const { personId } = useParams({ from: '/persons/$personId' });
	const { data: personResponse, isLoading, isError } = usePerson(personId);
	const person = (personResponse as unknown as PersonResponse)?.data;
	const updatePersonMutation = useUpdatePerson();
	const { register, handleSubmit, reset, formState: { errors } } = useForm<PersonFormData>({
		resolver: zodResolver(personSchema),
	});

	useEffect(() => {
		if (person) {
			reset({ name: person.name, surname: person.surname, patronymic: person.patronymic });
		}
	}, [person, reset]);

	const onSubmit = (data: PersonFormData): void => {
		updatePersonMutation.mutate({ id: personId, data });
	};

	if (isLoading) return <div>Loading person details...</div>;
	if (isError || !person) return <div>Person not found or failed to load.</div>;

	return (
		<div className="p-4">
			<h1 className="text-2xl font-bold mb-4">Edit Person:</h1>
			<form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
				<div>
					<label className="block font-medium" htmlFor="name">Name</label>
					<input id="name" {...register('name')} className="w-full p-2 border rounded" />
					{errors.name && <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>}
				</div>

				<div>
					<label className="block font-medium" htmlFor="surname">Surname</label>
					<input id="surname" {...register('surname')} className="w-full p-2 border rounded" />
					{errors.surname && <p className="text-red-500 text-sm mt-1">{errors.surname.message}</p>}
				</div>

				<div>
					<label className="block font-medium" htmlFor="patronymic">Patronymic</label>
					<input id="patronymic" {...register('patronymic')} className="w-full p-2 border rounded" />
					{errors.patronymic && <p className="text-red-500 text-sm mt-1">{errors.patronymic.message}</p>}
				</div>

				<button className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 disabled:bg-gray-400" disabled={updatePersonMutation.isPending} type="submit">
					{updatePersonMutation.isPending ? 'Saving...' : 'Save Changes'}
				</button>
			</form>
		</div>
	);
}