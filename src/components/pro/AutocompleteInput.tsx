import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Input } from '@/components/ui/input';
import { Check } from 'lucide-react';

interface AutocompleteInputProps {
  value: string;
  onChange: (value: string) => void;
  suggestions: string[];
  placeholder?: string;
  onSearch?: (query: string) => void;
  className?: string;
}

export const AutocompleteInput = ({
  value,
  onChange,
  suggestions,
  placeholder,
  onSearch,
  className,
}: AutocompleteInputProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (onSearch) {
      onSearch(value);
    }
  }, [value]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        !inputRef.current?.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setHighlightedIndex((prev) =>
          prev < suggestions.length - 1 ? prev + 1 : prev
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setHighlightedIndex((prev) => (prev > 0 ? prev - 1 : prev));
        break;
      case 'Enter':
        e.preventDefault();
        if (suggestions[highlightedIndex]) {
          onChange(suggestions[highlightedIndex]);
          setIsOpen(false);
        }
        break;
      case 'Escape':
        setIsOpen(false);
        break;
    }
  };

  const handleSelect = (suggestion: string) => {
    onChange(suggestion);
    setIsOpen(false);
    inputRef.current?.blur();
  };

  return (
    <div className="relative">
      <Input
        ref={inputRef}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onFocus={() => setIsOpen(true)}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        className={className}
        autoComplete="off"
      />

      <AnimatePresence>
        {isOpen && suggestions.length > 0 && (
          <motion.div
            ref={dropdownRef}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="absolute z-50 w-full mt-2 bg-white rounded-lg shadow-xl border border-gray-200 max-h-64 overflow-y-auto"
          >
            {suggestions.map((suggestion, index) => (
              <motion.div
                key={suggestion}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.03 }}
                onClick={() => handleSelect(suggestion)}
                onMouseEnter={() => setHighlightedIndex(index)}
                className={`
                  px-4 py-3 cursor-pointer transition-colors flex items-center justify-between
                  ${
                    index === highlightedIndex
                      ? 'bg-blue-50 text-blue-700'
                      : 'hover:bg-gray-50'
                  }
                  ${index === 0 ? 'rounded-t-lg' : ''}
                  ${index === suggestions.length - 1 ? 'rounded-b-lg' : ''}
                `}
              >
                <span className="text-sm font-medium">{suggestion}</span>
                {value.toLowerCase() === suggestion.toLowerCase() && (
                  <Check className="w-4 h-4 text-blue-600" />
                )}
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
