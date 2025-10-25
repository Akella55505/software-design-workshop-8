import { Link, Outlet } from "@tanstack/react-router";
import { useAccidents, useDeleteAccident } from '../api';
import type { ReactElement } from "react";
import type { Accident } from "../types";
import { Route } from "../../../routes/accidents.tsx";

type AccidentsResponse = {
	message: string;
	data: Array<Accident>;
}

export function AccidentsListPage(): ReactElement {
	const { data: accidentsResponse, isLoading, isError, error } = useAccidents();
	const deleteAccidentMutation = useDeleteAccident();
	const handleDelete = (id: string): void => {
		if (window.confirm('Are you sure you want to delete this accident?')) {
			deleteAccidentMutation.mutate(id);
		}
	};

	if (isLoading) return <div className="flex items-center justify-center h-screen text-4xl font-bold">Loading...</div>;

	if (isError) return <div className="flex items-center justify-center h-screen text-4xl font-bold">Error loading accidents: {error.message}</div>;

	return (
		<div className="p-4">
			<div className="flex justify-between items-center mb-4">
				<h1 className="text-2xl font-bold">Accidents</h1>
				<Link
					className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
					to="/accidents/new"
				>
					Create New Accident
				</Link>
			</div>

			<Outlet />

			<table className="min-w-full bg-white">
				<thead>
					<tr>
						<th className="py-2 px-4 border-b">Date</th>
						<th className="py-2 px-4 border-b">Media</th>
						<th className="py-2 px-4 border-b">Location</th>
						<th className="py-2 px-4 border-b">Causes</th>
						<th className="py-2 px-4 border-b">Consideration status</th>
						<th className="py-2 px-4 border-b">Assessment status</th>
						<th className="py-2 px-4 border-b">Type</th>
						<th className="py-2 px-4 border-b">Time</th>
						<th className="py-2 px-4 border-b">Persons</th>
						<th className="py-2 px-4 border-b">Vehicles</th>
						<th className="py-2 px-4 border-b">Actions</th>
					</tr>
				</thead>

				<tbody>
					{(accidentsResponse as unknown as AccidentsResponse)?.data.map(
						(accident: Accident) => (
							<tr key={accident.id}>
								<td className="py-2 px-4 border-b">
									{accident.date as unknown as string}
								</td>
								<td className="py-2 px-4 border-b">
									{accident.media !== "" ? accident.media : '—'}
								</td>
								<td className="py-2 px-4 border-b">{accident.location}</td>
								<td className="py-2 px-4 border-b">{accident.causes}</td>
								<td className="py-2 px-4 border-b">
									{accident.considerationStatus}
								</td>
								<td className="py-2 px-4 border-b">
									{accident.assessmentStatus}
								</td>
								<td className="py-2 px-4 border-b">{accident.type}</td>
								<td className="py-2 px-4 border-b">{accident.time}</td>
								<td className="py-2 px-4 border-b text-center">
									{accident.persons && accident.persons.length > 0
										? accident.persons
												.map((p) => `${p.name} ${p.surname}`)
												.join(", ")
										: "—"}
								</td>
								<td className="py-2 px-4 border-b text-center">
									{accident.vehicles && accident.vehicles.length > 0
										? accident.vehicles
												.map((v) => `${v.make} ${v.model} (${v.licensePlate})`)
												.join(", ")
										: "—"}
								</td>
								<td className="py-2 px-4 border-b text-center">
									<Link
										className="text-indigo-600 hover:text-indigo-900 mr-4"
										from={Route.fullPath}
										to={`./${accident.id as unknown as string}`}
									>
										Edit
									</Link>
									<button
										className="text-red-600 hover:text-red-900 disabled:opacity-50 cursor-pointer"
										disabled={deleteAccidentMutation.isPending}
										onClick={() => {
											handleDelete(accident.id as unknown as string);
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