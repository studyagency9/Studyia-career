import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { getMonths, years } from "@/data/suggestions";
import { cn } from "@/lib/utils";
import { useTranslation } from "@/i18n/i18nContext";

interface DateSelectorProps {
  value: string;
  onChange: (value: string) => void;
  label?: string;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
}

export const DateSelector = ({
  value,
  onChange,
  placeholder = "Sélectionner",
  className,
  disabled = false,
}: DateSelectorProps) => {
  const { t, language } = useTranslation();
  const months = getMonths(language);
  
  // Parse existing value (format: "Jan 2023" or "2023")
  const parseValue = (val: string) => {
    if (!val) return { month: "", year: "" };
    
    // Try to match "Mois Année" format
    const monthMatch = months.find(m => val.toLowerCase().startsWith(m.label.toLowerCase().substring(0, 3)));
    const yearMatch = val.match(/\d{4}/);
    
    return {
      month: monthMatch?.value || "",
      year: yearMatch ? yearMatch[0] : "",
    };
  };

  const { month, year } = parseValue(value);

  const handleMonthChange = (newMonth: string) => {
    const monthLabel = months.find(m => m.value === newMonth)?.label || "";
    const shortMonth = monthLabel.substring(0, 3);
    onChange(year ? `${shortMonth} ${year}` : shortMonth);
  };

  const handleYearChange = (newYear: string) => {
    const monthLabel = months.find(m => m.value === month)?.label || "";
    const shortMonth = monthLabel.substring(0, 3);
    onChange(month ? `${shortMonth} ${newYear}` : newYear);
  };

  return (
    <div className={cn("flex gap-2", className)}>
      <Select value={month} onValueChange={handleMonthChange} disabled={disabled}>
        <SelectTrigger className="flex-1 bg-background">
          <SelectValue placeholder={t('builder.common.month')} />
        </SelectTrigger>
        <SelectContent className="bg-background border border-border max-h-60">
          {months.map((m) => (
            <SelectItem key={m.value} value={m.value}>
              {m.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select value={year} onValueChange={handleYearChange} disabled={disabled}>
        <SelectTrigger className="flex-1 bg-background">
          <SelectValue placeholder={t('builder.common.year')} />
        </SelectTrigger>
        <SelectContent className="bg-background border border-border max-h-60">
          {years.map((y) => (
            <SelectItem key={y.value} value={y.value}>
              {y.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

// Simpler year-only selector
export const YearSelector = ({
  value,
  onChange,
  placeholder,
  className,
  disabled = false,
}: DateSelectorProps) => {
  const { t } = useTranslation();
  return (
    <Select value={value} onValueChange={onChange} disabled={disabled}>
      <SelectTrigger className={cn("bg-background", className)}>
        <SelectValue placeholder={placeholder || t('builder.common.year')} />
      </SelectTrigger>
      <SelectContent className="bg-background border border-border max-h-60">
        {years.map((y) => (
          <SelectItem key={y.value} value={y.value}>
            {y.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};
