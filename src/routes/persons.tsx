import { createFileRoute } from '@tanstack/react-router'
import { PersonsListPage } from '../features/persons/pages/PersonsListPage'

export const Route = createFileRoute('/persons')({
	component: PersonsListPage,
})
