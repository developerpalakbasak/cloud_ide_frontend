"use client";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";

function FancyText({ words = ["JavaScript", "TypeScript", "Python", "Go", "Java"] }) {
  const [wordIndex, setWordIndex] = useState(0);
  const [subIndex, setSubIndex] = useState(0);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    if (wordIndex >= words.length) return;

    const currentWord = words[wordIndex];

    // Speed settings
    const typingSpeed = deleting ? 80 : 150;
    const pauseTime = 1000;

    const timeout = setTimeout(() => {
      if (!deleting && subIndex === currentWord.length) {
        // Pause before deleting
        setTimeout(() => setDeleting(true), pauseTime);
      } else if (deleting && subIndex === 0) {
        // Move to next word
        setDeleting(false);
        setWordIndex((prev) => (prev + 1) % words.length);
      } else {
        setSubIndex((prev) => prev + (deleting ? -1 : 1));
      }
    }, typingSpeed);

    return () => clearTimeout(timeout);
  }, [subIndex, deleting, wordIndex, words]);

  return (
    <div className="text-3xl font-bold text-center my-2 flex flex-col gap-2">
      <motion.h1
        initial={{ y: 100, opacity: 0 }}
        whileInView={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.45 }}
        viewport={{ once: true, amount: 0 }}
      >
        Create projects using{" "}
      </motion.h1>
      {/* <br /> */}
      <span className="flex justify-center items-center">
        <motion.span
          initial={{ y: 100, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true, amount: 0 }} className="text-blue-500"
        >
          {words[wordIndex].substring(0, subIndex)}
        </motion.span>
        <span className="animate-pulse">_</span>
      </span>
    </div>
  );
}

export default FancyText