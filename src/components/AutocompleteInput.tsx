import { useState, useRef, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Search, Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface AutocompleteInputProps {
  value: string;
  onChange: (value: string) => void;
  onSelect?: (value: string) => void;
  suggestions: string[];
  placeholder?: string;
  label?: string;
  maxSuggestions?: number;
  className?: string;
}

export const AutocompleteInput = ({
  value,
  onChange,
  onSelect,
  suggestions,
  placeholder = "Rechercher...",
  label,
  maxSuggestions = 8,
  className,
}: AutocompleteInputProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [filteredSuggestions, setFilteredSuggestions] = useState<string[]>([]);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (value.length >= 1) {
      const filtered = suggestions
        .filter((s) =>
          s.toLowerCase().includes(value.toLowerCase())
        )
        .slice(0, maxSuggestions);
      setFilteredSuggestions(filtered);
      setIsOpen(filtered.length > 0);
    } else {
      setFilteredSuggestions([]);
      setIsOpen(false);
    }
  }, [value, suggestions, maxSuggestions]);

  const handleSelect = (suggestion: string) => {
    if (onSelect) {
      onSelect(suggestion);
    } else {
      onChange(suggestion);
    }
    setIsOpen(false);
    setHighlightedIndex(-1);
    inputRef.current?.blur();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen) return;

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setHighlightedIndex((prev) =>
          prev < filteredSuggestions.length - 1 ? prev + 1 : prev
        );
        break;
      case "ArrowUp":
        e.preventDefault();
        setHighlightedIndex((prev) => (prev > 0 ? prev - 1 : prev));
        break;
      case "Enter":
        e.preventDefault();
        if (highlightedIndex >= 0) {
          handleSelect(filteredSuggestions[highlightedIndex]);
        }
        break;
      case "Escape":
        setIsOpen(false);
        break;
    }
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        listRef.current &&
        !listRef.current.contains(e.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className={cn("relative", className)}>
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
        <Input
          ref={inputRef}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => {
            if (filteredSuggestions.length > 0) setIsOpen(true);
          }}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className="pl-10"
        />
      </div>

      {isOpen && filteredSuggestions.length > 0 && (
        <div
          ref={listRef}
          className="absolute z-50 w-full mt-1 bg-background border border-border rounded-lg shadow-lg overflow-hidden max-h-64 overflow-y-auto"
        >
          {filteredSuggestions.map((suggestion, index) => (
            <button
              key={suggestion}
              onClick={() => handleSelect(suggestion)}
              className={cn(
                "w-full px-4 py-3 text-left text-sm transition-colors flex items-center justify-between",
                highlightedIndex === index
                  ? "bg-primary/10 text-primary"
                  : "hover:bg-muted text-foreground"
              )}
            >
              <span>{suggestion}</span>
              {value.toLowerCase() === suggestion.toLowerCase() && (
                <Check className="w-4 h-4 text-primary" />
              )}
            </button>
          ))}
          {value.length > 0 && !filteredSuggestions.some(s => s.toLowerCase() === value.toLowerCase()) && (
            <button
              onClick={() => handleSelect(value)}
              className="w-full px-4 py-3 text-left text-sm transition-colors hover:bg-muted text-muted-foreground border-t border-border"
            >
              Utiliser "{value}" (personnalisé)
            </button>
          )}
        </div>
      )}
    </div>
  );
};