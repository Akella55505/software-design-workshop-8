import type { NestedPerson } from "../persons/types.ts";
import type { NestedVehicle } from "../vehicles/types";

export type Accident = {
	id: number;
	date: string;
	media?: string;
	location: string;
	causes: string;
	considerationStatus: ConsiderationStatus;
	assessmentStatus: AssessmentStatus;
	type: string;
	time: string;
	persons?: Array<NestedPerson>;
	vehicles?: Array<NestedVehicle>;
};

export enum ConsiderationStatus {
	Registered = 'Зареєстровано',
	SentToCourt = 'Передано до суду',
	Reviewed = 'Розглянуто',
}

export enum AssessmentStatus {
	InReview = 'На розгляді',
	Assessed = 'Оцінено',
	Agreed = 'Узгоджено',
}
