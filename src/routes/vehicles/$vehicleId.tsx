import { createFileRoute } from '@tanstack/react-router'
import { VehicleDetailPage } from "../../features/vehicles/pages/VehicleDetailPage.tsx";

export const Route = createFileRoute('/vehicles/$vehicleId')({
  component: VehicleDetailPage,
})
