import { createFileRoute } from '@tanstack/react-router'
import { AccidentDetailPage } from "../../features/accidents/pages/AccidentDetailPage.tsx";

export const Route = createFileRoute('/accidents/$accidentId')({
  component: AccidentDetailPage,
})
