import { lazy, Suspense } from "react";
import { AuthModalProps } from "./AuthModal";

// Lazy load the AuthModal
const AuthModal = lazy(() => import("./AuthModal"));

// Now, wrap the modal loading in Suspense
const AuthModalLoader = ({ isOpen, setIsOpen, type }: AuthModalProps) => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <AuthModal isOpen={isOpen} setIsOpen={setIsOpen} type={type} />
    </Suspense>
  );
};

export default AuthModalLoader;
