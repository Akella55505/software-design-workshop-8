import type { Person } from "../persons/types.ts";

export type Vehicle = {
	id: number;
	make: string;
	model: string;
	licensePlate: string;
	vin: string;
	personId: number;
	owner: Person;
};

export type NestedVehicle = {
	id: number;
	make: string;
	model: string;
	licensePlate: string;
}