import { motion } from 'framer-motion';
import { Check } from 'lucide-react';

interface Step {
  id: number;
  title: string;
  description: string;
}

interface FormStepperProps {
  steps: Step[];
  currentStep: number;
}

export const FormStepper = ({ steps, currentStep }: FormStepperProps) => {
  return (
    <div className="w-full py-8">
      <div className="flex items-center justify-between relative">
        {/* Progress Line */}
        <div className="absolute top-5 left-0 w-full h-0.5 bg-gray-200 -z-10">
          <motion.div
            className="h-full bg-gradient-to-r from-blue-600 to-purple-600"
            initial={{ width: '0%' }}
            animate={{ 
              width: `${((currentStep - 1) / (steps.length - 1)) * 100}%` 
            }}
            transition={{ duration: 0.5, ease: 'easeInOut' }}
          />
        </div>

        {/* Steps */}
        {steps.map((step, index) => {
          const stepNumber = index + 1;
          const isCompleted = stepNumber < currentStep;
          const isCurrent = stepNumber === currentStep;
          const isUpcoming = stepNumber > currentStep;

          return (
            <div key={step.id} className="flex flex-col items-center relative">
              {/* Circle */}
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: index * 0.1 }}
                className={`
                  w-10 h-10 rounded-full flex items-center justify-center
                  border-2 transition-all duration-300 z-10
                  ${isCompleted 
                    ? 'bg-gradient-to-r from-blue-600 to-purple-600 border-transparent text-white' 
                    : isCurrent
                    ? 'bg-white border-blue-600 text-blue-600 shadow-lg ring-4 ring-blue-100'
                    : 'bg-white border-gray-300 text-gray-400'
                  }
                `}
              >
                {isCompleted ? (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                  >
                    <Check className="w-5 h-5" />
                  </motion.div>
                ) : (
                  <span className="font-semibold">{stepNumber}</span>
                )}
              </motion.div>

              {/* Label */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 + 0.2 }}
                className="mt-3 text-center"
              >
                <p className={`
                  text-sm font-medium transition-colors
                  ${isCurrent ? 'text-blue-600' : isCompleted ? 'text-gray-700' : 'text-gray-400'}
                `}>
                  {step.title}
                </p>
                <p className={`
                  text-xs mt-1 transition-colors
                  ${isCurrent ? 'text-gray-600' : 'text-gray-400'}
                `}>
                  {step.description}
                </p>
              </motion.div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
