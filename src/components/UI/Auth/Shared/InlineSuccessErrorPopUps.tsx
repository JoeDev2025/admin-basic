import { motion } from "framer-motion";
import { FaTimes } from "react-icons/fa";

export const ErrorPopUp = ({
  error,
  setError,
}: {
  error: string | null;
  setError: (error: string | null) => void;
}) => {
  return (
    <div className="relative">
      <motion.div
        className="absolute  right-0 bottom-1 z-10 flex flex-col gap-2 justify-end bg-red-700 text-red-100 rounded-md py-2 px-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <p className="text-sm">{error}</p>
        <button
          className="absolute top-0 right-0 p-1 text-red-100  rounded-bl-md hover:bg-red-800 text-xs"
          onClick={() => setError(null)}
        >
          <FaTimes />
        </button>
      </motion.div>
    </div>
  );
};

export const SuccessPopUp = ({
  message,
  setMessage,
}: {
  message: string | null;
  setMessage: (message: string | null) => void;
}) => {
  return (
    <div className="relative">
      <motion.div
        className="absolute  right-0 bottom-1 z-10 flex flex-col gap-2 justify-end bg-green-700 text-green-100 rounded-md py-2 px-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <p className="text-sm">{message}</p>
        <button
          className="absolute top-0 right-0 p-1 text-green-100  rounded-bl-md hover:bg-green-800 text-xs"
          onClick={() => setMessage(null)}
        >
          <FaTimes />
        </button>
      </motion.div>
    </div>
  );
};
