import { useParams } from '@tanstack/react-router';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useVehicle, useUpdateVehicle } from '../api';
import { type ReactElement, useEffect } from "react";
import type { Vehicle } from "../types.ts";

const vehicleSchema = z.object({
	make: z.string().min(2, 'Make is too short'),
	model: z.string().min(2, 'Model is too short'),
	licensePlate: z.string().min(6, 'License plate is too short').max(12, 'License plate is too long'),
});

type VehicleResponse = {
	message: string;
	data: Vehicle;
}

type VehicleFormData = z.infer<typeof vehicleSchema>;

export function VehicleDetailPage(): ReactElement {
	const { vehicleId } = useParams({ from: '/vehicles/$vehicleId' });
	const { data: vehicleResponse, isLoading, isError } = useVehicle(vehicleId);
	const vehicle = (vehicleResponse as unknown as VehicleResponse)?.data;
	const updateVehicleMutation = useUpdateVehicle();
	const { register, handleSubmit, reset, formState: { errors } } = useForm<VehicleFormData>({
		resolver: zodResolver(vehicleSchema),
	});

	useEffect(() => {
		if (vehicle) {
			reset({ make: vehicle.make, model: vehicle.model, licensePlate: vehicle.licensePlate });
		}
	}, [vehicle, reset]);

	const onSubmit = (data: VehicleFormData): void => {
		updateVehicleMutation.mutate({ id: vehicleId, data });
	};

	if (isLoading) return <div>Loading vehicle details...</div>;
	if (isError || !vehicle) return <div>Vehicle not found or failed to load.</div>;

	return (
		<div className="p-4">
			<h1 className="text-2xl font-bold mb-4">Edit Vehicle:</h1>
			<form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
				<div>
					<label className="block font-medium" htmlFor="make">Make</label>
					<input id="make" {...register('make')} className="w-full p-2 border rounded" />
					{errors.make && <p className="text-red-500 text-sm mt-1">{errors.make.message}</p>}
				</div>
				<div>
					<label className="block font-medium" htmlFor="model">Model</label>
					<input id="model" step="0.01" type="string" {...register('model')} className="w-full p-2 border rounded" />
					{errors.model && <p className="text-red-500 text-sm mt-1">{errors.model.message}</p>}
				</div>
				<div>
					<label className="block font-medium" htmlFor="licensePlate">License plate</label>
					<input id="licensePlate" step="0.01" type="string" {...register('licensePlate')} className="w-full p-2 border rounded" />
					{errors.licensePlate && <p className="text-red-500 text-sm mt-1">{errors.licensePlate.message}</p>}
				</div>

				<button className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 disabled:bg-gray-400 cursor-pointer" disabled={updateVehicleMutation.isPending} type="submit">
					{updateVehicleMutation.isPending ? 'Saving...' : 'Save Changes'}
				</button>
			</form>
		</div>
	);
}