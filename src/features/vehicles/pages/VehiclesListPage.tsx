import { Link, Outlet } from "@tanstack/react-router";
import { useVehicles, useDeleteVehicle } from '../api';
import type { ReactElement } from "react";
import type { Vehicle } from "../types";
import { Route } from "../../../routes/vehicles.tsx";
import { loadingAnimation } from "../../../common/elements.tsx";

type VehiclesResponse = {
	message: string;
	data: Array<Vehicle>;
}

export function VehiclesListPage(): ReactElement {
	const { data: vehiclesResponse, isLoading, isError, error } = useVehicles();
	const deleteVehicleMutation = useDeleteVehicle();
	const handleDelete = (id: string): void => {
		if (window.confirm('Are you sure you want to delete this vehicle?')) {
			deleteVehicleMutation.mutate(id);
		}
	};

	if (isLoading) return loadingAnimation();

	if (isError) return <div className="flex items-center justify-center h-screen text-4xl font-bold">Error loading vehicles: {error.message}</div>;

	return (
		<div className="p-4">
			<div className="flex justify-between items-center mb-4">
				<h1 className="text-2xl font-bold">Vehicles</h1>
				<Link
					className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
					to="/vehicles/new"
				>
					Create New Vehicle
				</Link>
			</div>

			<Outlet />

			<table className="min-w-full bg-white">
				<thead>
				<tr>
					<th className="py-2 px-4 border-b">Make</th>
					<th className="py-2 px-4 border-b">Model</th>
					<th className="py-2 px-4 border-b">License plate</th>
					<th className="py-2 px-4 border-b">Owner</th>
					<th className="py-2 px-4 border-b">Actions</th>
				</tr>
				</thead>

				<tbody>
				{(vehiclesResponse as unknown as VehiclesResponse)?.data.map(
					(vehicle: Vehicle) => (
						<tr key={vehicle.id}>
							<td className="py-2 px-4 border-b">{vehicle.make}</td>
							<td className="py-2 px-4 border-b">{vehicle.model}</td>
							<td className="py-2 px-4 border-b">{vehicle.licensePlate}</td>
							<td className="py-2 px-4 border-b text-center">
								{vehicle.owner ? `${vehicle.owner.surname} ${vehicle.owner.name} ${vehicle.owner.patronymic}` : "—"}
							</td>
							<td className="py-2 px-4 border-b text-center">
								<Link
									className="text-indigo-600 hover:text-indigo-900 mr-4"
									from={Route.fullPath}
									to={`./${String(vehicle.id)}`}
								>
									Edit
								</Link>
								<button
									className="text-red-600 hover:text-red-900 disabled:opacity-50 cursor-pointer"
									disabled={deleteVehicleMutation.isPending}
									onClick={() => {
										handleDelete(String(vehicle.id));
									}}
								>
									Delete
								</button>
							</td>
						</tr>
					)
				)}
				</tbody>
			</table>
		</div>
	);
}