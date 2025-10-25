import { createFileRoute } from '@tanstack/react-router'
import { PersonDetailPage } from "../../features/persons/pages/PersonDetailPage.tsx";

export const Route = createFileRoute('/persons/$personId')({
	component: PersonDetailPage,
})
