import { useParams } from '@tanstack/react-router';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAccident, useUpdateAccident } from '../api';
import { type ReactElement, useEffect } from "react";
import type { Accident} from "../types.ts";
// eslint-disable-next-line no-duplicate-imports
import { AssessmentStatus, ConsiderationStatus } from "../types.ts";

const accidentSchema = z.object({
	date: z.string().regex(new RegExp("^\\d{4}-(0[1-9]|1[012])-(0[1-9]|[12][0-9]|3[01])$"), "Date has to be in YYYY-MM-DD format"),
	media: z.string().refine((value) => {
		if (value === "") return true;
		try {
			JSON.parse(value);
			return true;
		} catch {
			return false;
		}
	}, "Media has to be a JSON"),
	location: z.string().min(3, 'Location is too short'),
	causes: z.string().min(3, 'Causes are too short'),
	considerationStatus: z.enum(ConsiderationStatus, "Consideration status has to be a proper enum value"),
	assessmentStatus: z.enum(AssessmentStatus, "Assessment status has to be a proper enum value"),
	type: z.string().min(3, 'Type is too short'),
	time: z.iso.time().length(8, "Time has to be 8 symbols long"),
});

type AccidentResponse = {
	message: string;
	data: Accident;
}

type AccidentFormData = z.infer<typeof accidentSchema>;

export function AccidentDetailPage(): ReactElement {
	const { accidentId } = useParams({ from: '/accidents/$accidentId' });
	const { data: accidentResponse, isLoading, isError } = useAccident(accidentId);
	const accident = (accidentResponse as unknown as AccidentResponse)?.data;
	const updateAccidentMutation = useUpdateAccident();
	const { register, handleSubmit, reset, formState: { errors } } = useForm<AccidentFormData>({
		resolver: zodResolver(accidentSchema),
	});

	useEffect(() => {
		if (accident) {
			reset({ date: accident.date, media: accident.media, location: accident.location, causes: accident.causes, considerationStatus: accident.considerationStatus, assessmentStatus: accident.assessmentStatus, type: accident.type, time: accident.time });
		}
	}, [accident, reset]);

	const onSubmit = (data: AccidentFormData): void => {
		updateAccidentMutation.mutate({ id: accidentId, data });
	};

	if (isLoading) return <div>Loading accident details...</div>;
	if (isError || !accident) return <div>Accident not found or failed to load.</div>;

	return (
		<div className="p-4">
			<h1 className="text-2xl font-bold mb-4">Edit Accident:</h1>
			<form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
				<div>
					<label className="block font-medium" htmlFor="date">Date</label>
					<input id="date" {...register('date')} className="w-full p-2 border rounded" />
					{errors.date && <p className="text-red-500 text-sm mt-1">{errors.date.message}</p>}
				</div>
				<div>
					<label className="block font-medium" htmlFor="media">Media</label>
					<input id="media" {...register('media')} className="w-full p-2 border rounded" />
					{errors.media && <p className="text-red-500 text-sm mt-1">{errors.media.message}</p>}
				</div>
				<div>
					<label className="block font-medium" htmlFor="location">Location</label>
					<input id="location" step="0.01" type="string" {...register('location')} className="w-full p-2 border rounded" />
					{errors.location && <p className="text-red-500 text-sm mt-1">{errors.location.message}</p>}
				</div>
				<div>
					<label className="block font-medium" htmlFor="causes">Causes</label>
					<input id="causes" step="0.01" type="string" {...register('causes')} className="w-full p-2 border rounded" />
					{errors.causes && <p className="text-red-500 text-sm mt-1">{errors.causes.message}</p>}
				</div>
				<div>
					<label className="block font-medium" htmlFor="considerationStatus">Consideration status</label>
					<select
						id="considerationStatus"
						{...register('considerationStatus')}
						className="w-full p-2 border rounded"
					>
						<option value="">Оберіть статус</option>
						{Object.entries(ConsiderationStatus).map(([key, value]) => (
							<option key={key} value={value}>{value}</option>
						))}
					</select>
					{errors.considerationStatus && (
						<p className="text-red-500 text-sm mt-1">
							{errors.considerationStatus.message}
						</p>
					)}
				</div>

				<div>
					<label className="block font-medium" htmlFor="assessmentStatus">Assessment status</label>
					<select
						id="assessmentStatus"
						{...register('assessmentStatus')}
						className="w-full p-2 border rounded"
					>
						<option value="">Оберіть статус</option>
						{Object.entries(AssessmentStatus).map(([key, value]) => (
							<option key={key} value={value}>{value}</option>
						))}
					</select>
					{errors.assessmentStatus && (
						<p className="text-red-500 text-sm mt-1">
							{errors.assessmentStatus.message}
						</p>
					)}
				</div>
				<div>
					<label className="block font-medium" htmlFor="type">Type</label>
					<input id="type" step="0.01" type="string" {...register('type')} className="w-full p-2 border rounded" />
					{errors.type && <p className="text-red-500 text-sm mt-1">{errors.type.message}</p>}
				</div>
				<div>
					<label className="block font-medium" htmlFor="time">Time</label>
					<input id="time" step="0.01" type="string" {...register('time')} className="w-full p-2 border rounded" />
					{errors.time && <p className="text-red-500 text-sm mt-1">{errors.time.message}</p>}
				</div>

				<button className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 disabled:bg-gray-400 cursor-pointer" disabled={updateAccidentMutation.isPending} type="submit">
					{updateAccidentMutation.isPending ? 'Saving...' : 'Save Changes'}
				</button>
			</form>
		</div>
	);
}