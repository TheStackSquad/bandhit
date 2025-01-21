//src/components/UI/homeUI.jsx

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { novaFlat } from '@/app/fonts';


const HomePage = () => {
  const router = useRouter();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    const timer = setTimeout(() => {
      router.push('/welcome');
    }, 3000);
    return () => clearTimeout(timer);
  }, [router]);

  const textVariants = {
    initial: {
      opacity: 0,
      x: '-50%',
      y: '-50%',
      scale: 0.8,
    },
    animate: {
      opacity: 1,
      x: '-50%',
      y: '-50%',
      scale: 1,
      transition: {
        duration: 1,
        ease: "easeOut",
      }
    },
    exit: {
      opacity: 0,
      x: '-50%',
      y: '-50%',
      scale: 1.2,
      transition: {
        duration: 0.5,
        ease: "easeIn",
      }
    }
  };

  if (!isClient) return null; // Prevent hydration mismatch

  return (
    <div className="fixed inset-0  overflow-hidden">
      <AnimatePresence>
        <motion.h1
          className={`${novaFlat.variable} font-nova-flat fixed left-1/2 top-1/2 text-7xl font-bold text-white tracking-wider`}
          variants={textVariants}
          initial="initial"
          animate="animate"
          exit="exit"
        >
          bandhit
        </motion.h1>
      </AnimatePresence>
    </div>
  );
};

export default HomePage;