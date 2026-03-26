import { motion } from 'framer-motion';

const pageVariants = {
  initial: { 
    opacity: 0, 
    y: 20, 
    scale: 0.98,
    filter: "blur(5px)" // Adds that high-tech depth effect
  },
  in: { 
    opacity: 1, 
    y: 0, 
    scale: 1,
    filter: "blur(0px)"
  },
  out: { 
    opacity: 0, 
    y: -20, 
    scale: 1.02,
    filter: "blur(5px)"
  }
};

const pageTransition = {
  type: "tween",
  ease: "easeInOut",
  duration: 0.4
};

export default function PageTransition({ children }) {
  return (
    <motion.div
      initial="initial"
      animate="in"
      exit="out"
      variants={pageVariants}
      transition={pageTransition}
      className="w-full"
    >
      {children}
    </motion.div>
  );
}