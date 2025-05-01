"use client";

/**
 * @name AuthModal
 * @description A modal component that displays either a sign in or register form
 * @param isOpen boolean - Whether the modal is open or not
 * @param setIsOpen React.Dispatch<React.SetStateAction<boolean>> - Function to set the modal open or closed
 * @param type AuthFormType - The type of form to display e.g. "register" or "signin" etc
 * @returns JSX.Element
 * This modal can be loaded via the useAuthModal hook from the AuthModalProvider
 * See examples of how to use this component in AuthExamples.tsx
 */

import clsx from "clsx";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import { BiQrScan } from "react-icons/bi";
import { FaTimes } from "react-icons/fa";
import { FaHandPointer } from "react-icons/fa6";
import { FiHelpCircle, FiLogIn, FiUserPlus } from "react-icons/fi";
import { TfiEmail } from "react-icons/tfi";
import { CheckEmailForLink } from "./CheckEmailForLink";
import { CreateAccountForm } from "./CreateAccountForm";
import { EnterCodeForm } from "./EnterCodeForm";
import { ForgotPasswordForm } from "./ForgotPasswordForm";
import { SignInForm } from "./SignInForm";

export type AuthFormType =
  | "register"
  | "signin"
  | "forgotpassword"
  | "checkemail"
  | "entercode";

export type AuthModalProps = {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  type: AuthFormType;
};

// Used in each of the form components to switch between forms
export type SetFormTypeProps = {
  setFormType: React.Dispatch<React.SetStateAction<AuthFormType>>;
};

const AuthModal = ({ isOpen, setIsOpen, type }: AuthModalProps) => {
  const [formType, setFormType] = useState<AuthFormType>(type);
  const [hasMounted, setHasMounted] = useState(false);
  const [backgroundClicked, setBackgroundClicked] = useState(false);

  // Sync the formType state with the prop 'type' when modal opens
  useEffect(() => {
    setBackgroundClicked(false);
    if (isOpen) {
      setFormType(type);
      setHasMounted(true);
    } else {
      setHasMounted(false);
    }
  }, [isOpen, type]);

  let timer: NodeJS.Timeout;
  const handleBackgroundClicked = () => {
    clearTimeout(timer);
    setBackgroundClicked(true);
    timer = setTimeout(() => {
      setBackgroundClicked(false);
    }, 1000);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => handleBackgroundClicked()}
          onDoubleClick={() => setIsOpen(false)}
          className="bg-slate-900/20 backdrop-blur p-2 md:p-8 fixed inset-0 z-50 grid place-items-center overflow-y-scroll cursor-pointer"
        >
          <motion.div
            initial={{ scale: 0, rotate: "12.5deg" }}
            animate={{ scale: 1, rotate: "0deg" }}
            exit={{ scale: 0, rotate: "0deg" }}
            onClick={(e) => e.stopPropagation()}
            className="bg-zinc-100 dark:bg-zinc-950 text-white border border-zinc-400 dark:border-zinc-800 p2 md:p-6 rounded-lg w-full max-w-2xl shadow-xl cursor-default relative overflow-hidden"
            layout // Animate modal height smoothly (not working)
            transition={{ layout: { duration: 0.5, ease: "easeInOut" } }}
          >
            <div className="relative z-10 text-zinc-800 dark:text-zinc-200">
              <AnimatePresence mode="wait" initial={false}>
                <motion.div
                  key={formType} // Ensure this changes when formType changes
                  initial={{ rotateY: 90, opacity: 0 }}
                  animate={{ rotateY: 0, opacity: 1 }}
                  exit={hasMounted ? { rotateY: 90, opacity: 0 } : {}}
                  transition={{
                    duration: 0.6,
                    ease: "linear",
                  }}
                  className="relative z-10 mx-auto w-full max-w-xl p-4"
                >
                  {formType === "register" ? (
                    <CreateAccountForm setFormType={setFormType} />
                  ) : formType === "forgotpassword" ? (
                    <ForgotPasswordForm setFormType={setFormType} />
                  ) : formType === "checkemail" ? (
                    <CheckEmailForLink setFormType={setFormType} />
                  ) : formType === "entercode" ? (
                    <EnterCodeForm setFormType={setFormType} />
                  ) : (
                    <SignInForm setFormType={setFormType} />
                  )}
                </motion.div>
              </AnimatePresence>
            </div>

            <CornerGrid />

            {/* Animate all icons together */}
            <AnimatePresence>
              <motion.div
                key={formType}
                initial={{ y: 50, x: -50, opacity: 0 }}
                animate={{ y: 0, x: 0, opacity: 1 }}
                exit={hasMounted ? { y: 50, x: -50, opacity: 0 } : {}}
                transition={{ duration: 0.75, ease: "easeInOut" }}
                className="absolute z-0 -top-2 -left-2"
              >
                {formType === "register" ? (
                  <FiUserPlus className="text-emerald-300/20 rotate-12 text-[120px] md:text-[150px] absolute -top-2 -left-2" />
                ) : formType === "signin" ? (
                  <FiLogIn className="text-sky-300/20 rotate-12 text-[120px] md:text-[150px] absolute -top-2 -left-2" />
                ) : formType === "forgotpassword" ? (
                  <FiHelpCircle className="text-amber-300/20 rotate-12 text-[120px] md:text-[150px] absolute -top-2 -left-2" />
                ) : formType === "checkemail" ? (
                  <TfiEmail className="text-amber-300/20 rotate-12 text-[120px] md:text-[150px] absolute -top-2 -left-2" />
                ) : formType === "entercode" ? (
                  <BiQrScan className="text-amber-300/20 rotate-12 text-[120px] md:text-[150px] absolute -top-2 -left-2" />
                ) : (
                  <div className="text-red-500">Error - incorrect formType</div>
                )}
              </motion.div>
            </AnimatePresence>

            {/* Close button X top right*/}
            <div className="absolute z-30 top-1 right-1">
              <button
                onClick={() => setIsOpen(false)}
                className={clsx(
                  backgroundClicked ? "" : "",
                  "p-2 h-8 w-8 rounded-full bg-zinc-400 dark:bg-zinc-800 text-slate-900 dark:text-zinc-300 cursor-pointer opacity-60 hover:opacity-100 transition-all hover:scale-[120%]",
                )}
              >
                <FaTimes />
                <span className="sr-only">Close</span>
              </button>
              {
                // Show a hint to close the modal if the background is clicked
                backgroundClicked && (
                  <motion.div
                    initial={{ opacity: 0, x: -12, y: 12 }}
                    animate={{
                      opacity: [0, 1, 1, 0],
                      x: [-12, 0, 0],
                      y: [12, 0, 0],
                    }}
                    transition={{ duration: 1 }}
                    className="absolute -bottom-4 right-2  flex items-center justify-end w-64 text-slate-900 dark:text-yellow-300 gap-2"
                  >
                    <span>Close here</span>
                    <FaHandPointer className="w-6 h-6" />
                  </motion.div>
                )
              }
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

const CornerGrid = () => {
  return (
    <div
      style={{
        backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32' width='32' height='32' fill='none' stroke-width='2' stroke='rgb(30 58 138 / 0.5)'%3e%3cpath d='M0 .5H31.5V32'/%3e%3c/svg%3e")`,
      }}
      className="absolute right-0 top-0 z-0 size-[75vw] md:size-[50vw] opacity-50 dark:opacity-100"
    >
      <div
        style={{
          backgroundImage:
            "radial-gradient(100% 100% at 100% 0%, rgba(9,9,11,0), rgba(9,9,11,1))",
        }}
        className="absolute inset-0 invert dark:invert-0"
      />
    </div>
  );
};

export default AuthModal;
