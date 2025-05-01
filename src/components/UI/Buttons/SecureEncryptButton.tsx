"use client";

import clsx from "clsx";
import { motion } from "framer-motion";
import { useRef, useState } from "react";
import { FiLoader, FiLock } from "react-icons/fi";

// Constants
const CYCLES_PER_LETTER = 2;
const SHUFFLE_TIME = 50;
const CHARS = "!@#$%^&*():{};|,.<>/?";

type SecureEncryptButtonProps = {
  colorStyle: "blue" | "green" | "rose" | "sky" | "orange";
  btnText: string;
  icon?: React.ReactNode;
  isLoadingState?: boolean;
  onClick?: () => void;
};

const SecureEncryptButton = ({
  btnText,
  colorStyle,
  icon,
  isLoadingState,
  onClick,
}: SecureEncryptButtonProps) => {
  const intervalRef = useRef<null | NodeJS.Timeout>(null);

  const TARGET_TEXT = btnText;
  const [text, setText] = useState(TARGET_TEXT);

  const scramble = () => {
    let pos = 0;

    intervalRef.current = setInterval(() => {
      const scrambled = TARGET_TEXT.split("")
        .map((char, index) => {
          if (pos / CYCLES_PER_LETTER > index) {
            return char;
          }

          const randomCharIndex = Math.floor(Math.random() * CHARS.length);
          const randomChar = CHARS[randomCharIndex];

          return randomChar;
        })
        .join("");

      setText(scrambled);
      pos++;

      if (pos >= TARGET_TEXT.length * CYCLES_PER_LETTER) {
        stopScramble();
      }
    }, SHUFFLE_TIME);
  };

  const stopScramble = () => {
    clearInterval(intervalRef.current || undefined);

    setText(TARGET_TEXT);
  };

  return (
    <div className="relative  overflow-hidden  rounded-md">
      <motion.button
        whileHover={{
          scale: 1.025,
        }}
        whileTap={{
          scale: 0.975,
        }}
        onMouseEnter={scramble}
        onMouseLeave={stopScramble}
        onClick={onClick}
        className={clsx(
          `group font-mono overflow-hidden w-full bg-gradient-to-br px-4 py-2 text-lg text-zinc-50 ring-2  ring-offset-2 ring-offset-zinc-950 transition-all hover:scale-[1.02] hover:ring-transparent  
        `,
          colorStyle === "blue" &&
            "from-blue-400 to-blue-700 ring-blue-500/50 active:ring-blue-500/70",
          colorStyle === "green" &&
            "from-green-400 to-green-700 ring-green-500/50 active:ring-green-500/70",
          colorStyle === "rose" &&
            "from-rose-400 to-rose-700 ring-rose-500/50 active:ring-rose-500/70",
          colorStyle === "sky" &&
            "from-sky-400 to-sky-700 ring-sky-500/50 active:ring-sky-500/70",
          colorStyle === "orange" &&
            "from-orange-400 to-orange-700 ring-orange-500/50 active:ring-orange-500/70",
        )}
      >
        <div className="relative z-10 flex items-center gap-2 justify-center font-bold">
          <span className="w-6 text-center">
            {isLoadingState ? (
              <FiLoader className="animate-spin" />
            ) : (
              icon || <FiLock />
            )}
          </span>
          <span>{text}</span>
        </div>

        {/* The beam flash */}
        <motion.span
          initial={{
            y: "100%",
          }}
          animate={{
            y: "-100%",
          }}
          transition={{
            repeat: Infinity,
            repeatType: "mirror",
            duration: 1,
            ease: "linear",
          }}
          className={clsx(
            isLoadingState ? "opacity-80" : "opacity-0 group-hover:opacity-80",
            `transition-opacity duration-300 absolute inset-0 z-0 scale-125 bg-gradient-to-t from-sky-100/0 from-40% via-sky-100/100 to-sky-200/0 to-60% `,
          )}
        />
      </motion.button>
    </div>
  );
};

export default SecureEncryptButton;
