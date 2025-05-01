import { FiLoader } from "react-icons/fi";

const Loader = ({ size = "12" }) => {
	return (
		<div className="flex justify-center items-center">
			<FiLoader className={`animate-spin w-${size} h-${size} text-sky-500`} />
		</div>
	);
};

export const LoaderExtraLarge = () => <Loader size="32" />;
export const LoaderLarge = () => <Loader size="16" />;
export const LoaderMedium = () => <Loader size="12" />;
export const LoaderSmall = () => <Loader size="6" />;
export const LoaderTiny = () => <FiLoader className={`animate-spin w-4 h-4`} />;

/*
If adding new sizes above you may need to add the following to the tailwind.config.js file:
module.exports = {
  // ... other Tailwind configurations
  safelist: [
    'w-4', 'h-4',
    'w-6', 'h-6',
    'w-12', 'h-12',
    'w-16', 'h-16',
    'w-32', 'h-32'
  ],
};
*/
