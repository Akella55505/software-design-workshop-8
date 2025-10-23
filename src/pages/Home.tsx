import type { FunctionComponent } from "../common/types";

export const Home = (): FunctionComponent => {
	return (
		<div className="bg-gray-700 font-bold w-screen h-screen flex flex-col justify-center items-center">
			<p className="text-white text-6xl">Sample text</p>
		</div>
	);
};
