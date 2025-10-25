import { createFileRoute } from '@tanstack/react-router'
import { VehiclesListPage } from "../features/vehicles/pages/VehiclesListPage.tsx";

export const Route = createFileRoute('/vehicles')({
  component: VehiclesListPage,
})
