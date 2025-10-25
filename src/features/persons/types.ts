import type { NestedVehicle } from "../vehicles/types.ts";

export type Person = {
	id: string;
	name: string;
	surname: string;
	patronymic: string;
	passportData: string;
	driverLicense: string;
	vehicles?: Array<NestedVehicle>;
};

export type NestedPerson = {
	id: string;
	name: string;
	surname: string;
	patronymic: string;
};