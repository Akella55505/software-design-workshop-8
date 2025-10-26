import {createRootRoute} from "@tanstack/react-router";
import {AppLayout} from "../components/layout/AppLayout.tsx";

export const Route = createRootRoute({
	component: () => (
		<div>
			<AppLayout />
		</div>
	),
});
