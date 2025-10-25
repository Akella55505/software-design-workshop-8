import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useCreatePerson } from '../api';
import type { ReactElement } from "react";
import type { Person } from "../types.ts";
import { isAxiosError } from "axios";

const personSchema = z.object({
	name: z.string().min(2, "Name is too short"),
	surname: z.string().min(2, 'Surname is too short'),
	patronymic: z.string().min(2, 'Patronymic is too short'),
	driverLicense: z.string().refine((value) => {
		try {
			JSON.parse(value);
			return true;
		} catch {
			return false;
		}
	}, "Driver license has to be a JSON"),
	passportData: z.string().refine((value) => {
		try {
			JSON.parse(value);
			return true;
		} catch {
			return false;
		}
	}, "Passport data has to be a JSON"),
});

type PersonFormData = z.infer<typeof personSchema>;

export function PersonCreatePage(): ReactElement {
	const createPersonMutation = useCreatePerson();

	const {
		register,
		handleSubmit,
		formState: { errors },
		reset,
	} = useForm<PersonFormData>({
		resolver: zodResolver(personSchema),
	});

	const onSubmit = (data: PersonFormData): void => {
		createPersonMutation.mutate(data as Omit<Person, "id">, {
			onSuccess: () => { reset(); },
			onError: (error: unknown) => {
				if (isAxiosError(error)) {
					if (error.response?.status === 409) {
						alert("A person with these passport data already exists.");
						return;
					}
				}
				alert("Unexpected error occurred.");
			},
		});
	};

	return (
		<div className="p-4">
			<h1 className="text-2xl font-bold mb-4">Create New Person</h1>
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

				<div>
					<label className="block font-medium" htmlFor="passportData">Passport data</label>
					<input id="passportData" {...register('passportData')} className="w-full p-2 border rounded" />
					{errors.passportData && <p className="text-red-500 text-sm mt-1">{errors.passportData.message}</p>}
				</div>

				<div>
					<label className="block font-medium" htmlFor="driverLicense">Driver license</label>
					<input id="driverLicense" {...register('driverLicense')} className="w-full p-2 border rounded" />
					{errors.driverLicense && <p className="text-red-500 text-sm mt-1">{errors.driverLicense.message}</p>}
				</div>

				<button
					className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:bg-gray-400 cursor-pointer"
					disabled={createPersonMutation.isPending}
					type="submit"
				>
					{createPersonMutation.isPending ? 'Creating...' : 'Create Person'}
				</button>
			</form>
		</div>
	);
}
