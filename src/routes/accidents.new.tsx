import { createFileRoute } from '@tanstack/react-router'
import { AccidentCreatePage } from "../features/accidents/pages/AccidentCreatePage.tsx";

export const Route = createFileRoute('/accidents/new')({
  component: AccidentCreatePage,
})
