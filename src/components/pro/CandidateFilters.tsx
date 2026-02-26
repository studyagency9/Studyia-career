import { useState } from 'react';
import { Filter, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';

interface FilterState {
  gender?: string;
  degree?: string;
  city?: string;
  minExperience?: number;
  minScore?: number;
  search?: string;
}

interface CandidateFiltersProps {
  onFilterChange: (filters: FilterState) => void;
}

export const CandidateFilters = ({ onFilterChange }: CandidateFiltersProps) => {
  const [filters, setFilters] = useState<FilterState>({});
  const [isExpanded, setIsExpanded] = useState(false);

  const updateFilter = (key: keyof FilterState, value: any) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const clearFilters = () => {
    setFilters({});
    onFilterChange({});
  };

  const activeFilterCount = Object.values(filters).filter(Boolean).length;

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Filter className="w-5 h-5 text-gray-600" />
          <h3 className="font-semibold text-gray-900">Filters</h3>
          {activeFilterCount > 0 && (
            <span className="bg-blue-100 text-blue-700 text-xs font-medium px-2 py-1 rounded-full">
              {activeFilterCount}
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          {activeFilterCount > 0 && (
            <Button variant="ghost" size="sm" onClick={clearFilters}>
              <X className="w-4 h-4 mr-1" />
              Clear
            </Button>
          )}
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsExpanded(!isExpanded)}
          >
            {isExpanded ? 'Collapse' : 'Expand'}
          </Button>
        </div>
      </div>

      {/* Search Bar */}
      <div className="mb-4">
        <Input
          placeholder="Search by name, email, or skills..."
          value={filters.search || ''}
          onChange={(e) => updateFilter('search', e.target.value)}
          className="w-full"
        />
      </div>

      {/* Expandable Filters */}
      {isExpanded && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 pt-4 border-t border-gray-100">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Gender
            </label>
            <Select
              value={filters.gender}
              onValueChange={(value) => updateFilter('gender', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="All" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="M">Male</SelectItem>
                <SelectItem value="F">Female</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Degree
            </label>
            <Select
              value={filters.degree}
              onValueChange={(value) => updateFilter('degree', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="All" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="bachelor">Bachelor</SelectItem>
                <SelectItem value="master">Master</SelectItem>
                <SelectItem value="phd">PhD</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              City
            </label>
            <Select
              value={filters.city}
              onValueChange={(value) => updateFilter('city', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="All" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="dakar">Dakar</SelectItem>
                <SelectItem value="abidjan">Abidjan</SelectItem>
                <SelectItem value="douala">Douala</SelectItem>
                <SelectItem value="yaounde">Yaoundé</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Min. Score
            </label>
            <Select
              value={filters.minScore?.toString()}
              onValueChange={(value) => updateFilter('minScore', parseInt(value))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Any" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="0">Any</SelectItem>
                <SelectItem value="40">40+</SelectItem>
                <SelectItem value="60">60+</SelectItem>
                <SelectItem value="80">80+</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      )}
    </div>
  );
};
