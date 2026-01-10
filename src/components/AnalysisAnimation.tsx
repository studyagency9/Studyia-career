import { motion } from 'framer-motion';
import { FileText } from 'lucide-react';

export const AnalysisAnimation = () => {
  return (
    <div className="flex flex-col items-center justify-center text-primary w-64 h-64">
      <div className="relative w-24 h-32">
        <FileText className="w-full h-full text-gray-300 dark:text-gray-600" strokeWidth={1} />
        <motion.div
          className="absolute top-0 left-0 right-0 h-1 bg-primary/50"
          animate={{ y: [0, 120] }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            repeatType: 'loop',
            ease: 'easeInOut',
          }}
        />
        <div className="absolute inset-0 overflow-hidden">
          {[...Array(5)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute left-0 w-full h-px bg-primary/30"
              initial={{ opacity: 0, y: 128 }}
              animate={{ opacity: [0, 1, 0], y: [128, -10] }}
              transition={{
                duration: 2,
                repeat: Infinity,
                delay: i * 0.4,
                ease: 'easeOut',
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
