import { motion } from "framer-motion";
import { ReactNode } from "react";

interface PageTransitionProps {
  children: ReactNode;
}

/**
 * Wraps page content in a smooth fade-in animation.
 * Triggers naturally on mount — no AnimatePresence needed.
 * Each time a route becomes active, this component mounts fresh,
 * and the initial → animate transition fires automatically.
 */
export function PageTransition({ children }: PageTransitionProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.2,
        ease: [0.25, 0.1, 0.25, 1],
      }}
      style={{ width: "100%", minHeight: "100%" }}
    >
      {children}
    </motion.div>
  );
}

export default PageTransition;
