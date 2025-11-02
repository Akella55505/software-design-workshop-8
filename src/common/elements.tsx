import type { ReactElement } from "react";

export const loadingAnimation = (): ReactElement => {
	return (
		<div className="flex items-center justify-center h-screen">
			<div className="w-16 h-16 border-4 border-gray-300 border-t-blue-500 rounded-full animate-spin" />
		</div>
	);
}