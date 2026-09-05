"use client";

import { motion } from "framer-motion";

export default function AnimatedBackground() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Gradient Blob 1 - Purple */}
      <motion.div
        className="absolute w-[500px] h-[500px] rounded-full bg-linear-to-r from-violet-400/30 to-purple-400/30 blur-3xl"
        animate={{
          x: [0, 100, 0],
          y: [0, -50, 0],
          scale: [1, 1.2, 1],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        style={{ top: "-10%", left: "-5%" }}
      />

      {/* Gradient Blob 2 - Fuchsia */}
      <motion.div
        className="absolute w-[600px] h-[600px] rounded-full bg-linear-to-r from-fuchsia-400/20 to-pink-400/20 blur-3xl"
        animate={{
          x: [0, -80, 0],
          y: [0, 100, 0],
          scale: [1, 1.3, 1],
        }}
        transition={{
          duration: 25,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        style={{ top: "20%", right: "-10%" }}
      />

      {/* Gradient Blob 3 - Cyan */}
      <motion.div
        className="absolute w-[400px] h-[400px] rounded-full bg-linear-to-r from-cyan-400/20 to-blue-400/20 blur-3xl"
        animate={{
          x: [0, 50, 0],
          y: [0, -80, 0],
          scale: [1, 1.1, 1],
        }}
        transition={{
          duration: 18,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        style={{ bottom: "10%", left: "30%" }}
      />

      {/* Gradient Blob 4 - Amber */}
      <motion.div
        className="absolute w-[450px] h-[450px] rounded-full bg-linear-to-r from-amber-400/15 to-orange-400/15 blur-3xl"
        animate={{
          x: [0, -60, 0],
          y: [0, 70, 0],
          scale: [1, 1.15, 1],
        }}
        transition={{
          duration: 22,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        style={{ bottom: "-5%", right: "10%" }}
      />
    </div>
  );
}
