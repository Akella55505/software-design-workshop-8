import { Link, Outlet } from "@tanstack/react-router";
import { usePersons, useDeletePerson } from '../api';
import type { ReactElement } from "react";
import type { Person } from "../types";
import { Route } from "../../../routes/persons.tsx";

type PersonsResponse = {
	message: string;
	data: Array<Person>;
}

export function PersonsListPage(): ReactElement {
	const { data: personsResponse, isLoading, isError, error } = usePersons();
	const deletePersonMutation = useDeletePerson();
	const handleDelete = (id: string): void => {
		if (window.confirm('Are you sure you want to delete this person?')) {
			deletePersonMutation.mutate(id);
		}
	};

	if (isLoading) return <div className="flex items-center justify-center h-screen text-4xl font-bold">Loading...</div>;

	if (isError) return <div className="flex items-center justify-center h-screen text-4xl font-bold">Error loading persons: {error.message}</div>;

	return (
		<div className="p-4">
			<div className="flex justify-between items-center mb-4">
				<h1 className="text-2xl font-bold">Persons</h1>
				<Link
					className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
					to="/persons/new"
				>
					Create New Person
				</Link>
			</div>

			<Outlet />

			<table className="min-w-full bg-white">
				<thead>
				<tr>
					<th className="py-2 px-4 border-b">Name</th>
					<th className="py-2 px-4 border-b">Surname</th>
					<th className="py-2 px-4 border-b">Patronymic</th>
					<th className="py-2 px-4 border-b">Vehicles</th>
				</tr>
				</thead>

				<tbody>
				{(personsResponse as unknown as PersonsResponse)?.data.map(
					(person: Person) => (
						<tr key={person.id}>
							<td className="py-2 px-4 border-b">{person.name}</td>
							<td className="py-2 px-4 border-b">{person.surname}</td>
							<td className="py-2 px-4 border-b">{person.patronymic}</td>
							<td className="py-2 px-4 border-b text-center">
								{person.vehicles && person.vehicles.length > 0
									? person.vehicles
										.map((v) => `${v.make} ${v.model} (${v.licensePlate})`)
										.join(", ")
									: "—"}
							</td>
							<td className="py-2 px-4 border-b text-center">
								<Link
									className="text-indigo-600 hover:text-indigo-900 mr-4"
									from={Route.fullPath}
									to={`./${person.id as unknown as string}`}
								>
									Edit
								</Link>
								<button
									className="text-red-600 hover:text-red-900 disabled:opacity-50 cursor-pointer"
									disabled={deletePersonMutation.isPending}
									onClick={() => {
										handleDelete(person.id as unknown as string);
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