import { createFileRoute } from '@tanstack/react-router'
import { AccidentsListPage } from '../features/accidents/pages/AccidentsListPage'

export const Route = createFileRoute('/accidents')({
  component: AccidentsListPage,
})
