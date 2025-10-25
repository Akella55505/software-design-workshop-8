import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useCreateVehicle } from '../api';
import { useState, type ReactElement } from "react";
import type { Vehicle } from "../types.ts";
import { usePersons } from "../../persons/api.ts";
import type { PersonsResponse } from "../../persons/pages/PersonsListPage"
import type { Person } from "../../persons/types.ts";
import { isAxiosError } from "axios";

const vehicleSchema = z.object({
	make: z.string().min(2, 'Make is too short'),
	model: z.string().min(2, 'Model is too short'),
	licensePlate: z.string().min(6, 'License plate is too short').max(12, 'License plate is too long'),
	vin: z.string().regex(new RegExp("^[A-HJ-NPR-Z0-9]{17}$"), 'VIN has to be legit'),
	personId: z.number(),
});

type VehicleFormData = z.infer<typeof vehicleSchema>;

function CustomSelect({
												options,
												value,
												onChange,
											}: {
	options: Array<{ value: string; label: string }>;
	value: number;
	onChange: (value_: number) => void;
}): ReactElement {
	const [isOpen, setIsOpen] = useState(false);
	const selected = options.find((o) => Number(o.value) === value);

	return (
		<div className="relative w-full">
			<button
				className="w-full border rounded p-2 text-left bg-white"
				type="button"
				onClick={() => { setIsOpen(!isOpen); }}
			>
				{selected ? selected.label : "Оберіть власника"}
			</button>

			{isOpen && (
				<div className="absolute mt-1 w-full max-h-40 overflow-y-auto border rounded bg-white shadow z-10">
					{options.map((opt) => (
						<div
							key={opt.value}
							className={`p-2 cursor-pointer hover:bg-gray-100 ${
								selected?.value === opt.value ? "bg-gray-200" : ""
							}`}
							onClick={() => {
								onChange(Number(opt.value));
								setIsOpen(false);
							}}
						>
							{opt.label}
						</div>
					))}
				</div>
			)}
		</div>
	);
}

export function VehicleCreatePage(): ReactElement {
	const { data: personsResponse } = usePersons();
	const createVehicleMutation = useCreateVehicle();

	const {
		register,
		handleSubmit,
		formState: { errors },
		reset,
		setValue,
		watch
	} = useForm<VehicleFormData>({
		resolver: zodResolver(vehicleSchema),
	});

	const onSubmit = (data: VehicleFormData): void => {
		createVehicleMutation.mutate(data as Omit<Vehicle, "id">, {
			onSuccess: () => { reset(); },
			onError: (error: unknown) => {
				if (isAxiosError(error)) {
					if (error.response?.status === 409) {
						alert("A vehicle with this vin already exists.");
						return;
					}
				}
				alert("Unexpected error occurred.");
			},
		});
	};

	const personId = watch("personId");

	const persons =
		(personsResponse as unknown as PersonsResponse)?.data.map((person: Person) => ({
			value: person.id,
			label: `${person.surname} ${person.name} ${person.patronymic}`,
		})) || [];

	return (
		<div className="p-4">
			<h1 className="text-2xl font-bold mb-4">Create New Vehicle</h1>
			<form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
				<div>
					<label className="block font-medium" htmlFor="make">Make</label>
					<input id="make" {...register('make')} className="w-full p-2 border rounded" />
					{errors.make && <p className="text-red-500 text-sm mt-1">{errors.make.message}</p>}
				</div>

				<div>
					<label className="block font-medium" htmlFor="model">Model</label>
					<input id="model" {...register('model')} className="w-full p-2 border rounded" />
					{errors.model && <p className="text-red-500 text-sm mt-1">{errors.model.message}</p>}
				</div>

				<div>
					<label className="block font-medium" htmlFor="licensePlate">License plate</label>
					<input id="licensePlate" {...register('licensePlate')} className="w-full p-2 border rounded" />
					{errors.licensePlate && <p className="text-red-500 text-sm mt-1">{errors.licensePlate.message}</p>}
				</div>

				<div>
					<label className="block font-medium" htmlFor="vin">VIN</label>
					<input id="vin" {...register('vin')} className="w-full p-2 border rounded" />
					{errors.vin && <p className="text-red-500 text-sm mt-1">{errors.vin.message}</p>}
				</div>

				<div>
					<label className="block font-medium" htmlFor="personId">Owner</label>
					<CustomSelect
						options={persons}
						value={personId}
						onChange={(value) => { setValue("personId", Number(value)); }}
					/>
					{errors.personId && <p className="text-red-500 text-sm">{errors.personId.message}</p>}
				</div>

				<button
					className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:bg-gray-400 cursor-pointer"
					disabled={createVehicleMutation.isPending}
					type="submit"
				>
					{createVehicleMutation.isPending ? 'Creating...' : 'Create Vehicle'}
				</button>
			</form>
		</div>
	);
}
