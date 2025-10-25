import { createFileRoute } from '@tanstack/react-router'
import { VehicleCreatePage } from "../features/vehicles/pages/VehicleCreatePage.tsx";

export const Route = createFileRoute('/vehicles/new')({
  component: VehicleCreatePage,
})
