import React from 'react';
import { Search, Filter, X } from 'lucide-react';

interface ActionSearchFilterProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  selectedCategories: string[];
  onCategoryToggle: (category: string) => void;
  availableCategories: string[];
  quickFilters: {
    recent: boolean;
    popular: boolean;
  };
  onQuickFilterToggle: (filter: 'recent' | 'popular') => void;
}

export const ActionSearchFilter: React.FC<ActionSearchFilterProps> = ({
  searchQuery,
  onSearchChange,
  selectedCategories,
  onCategoryToggle,
  availableCategories,
  quickFilters,
  onQuickFilterToggle
}) => {
  const clearAllFilters = () => {
    onSearchChange('');
    selectedCategories.forEach(cat => onCategoryToggle(cat));
    if (quickFilters.recent) onQuickFilterToggle('recent');
    if (quickFilters.popular) onQuickFilterToggle('popular');
  };

  const hasActiveFilters = searchQuery || selectedCategories.length > 0 || 
    quickFilters.recent || quickFilters.popular;

  return (
    <div className="space-y-3">
      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
        <input
          type="text"
          placeholder="Search actions..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full pl-10 pr-4 py-2 border border-input rounded-lg bg-background text-sm focus:ring-2 focus:ring-ring focus:border-transparent"
        />
        {searchQuery && (
          <button
            onClick={() => onSearchChange('')}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Filters Row */}
      <div className="flex flex-wrap items-center gap-2">
        <div className="flex items-center gap-1 text-sm font-medium text-muted-foreground">
          <Filter className="w-4 h-4" />
          Filters:
        </div>

        {/* Quick Filters */}
        <button
          onClick={() => onQuickFilterToggle('popular')}
          className={`px-2 py-1 text-xs rounded-full border transition-colors ${
            quickFilters.popular 
              ? 'bg-[hsl(var(--color-accent-blue-bg))] text-[hsl(var(--color-accent-blue))] border-[hsl(var(--color-accent-blue))]/20'
              : 'bg-muted text-muted-foreground border-border hover:bg-muted/80'
          }`}
        >
          Popular
        </button>
        
        <button
          onClick={() => onQuickFilterToggle('recent')}
          className={`px-2 py-1 text-xs rounded-full border transition-colors ${
            quickFilters.recent 
              ? 'bg-[hsl(var(--color-accent-blue-bg))] text-[hsl(var(--color-accent-blue))] border-[hsl(var(--color-accent-blue))]/20' 
              : 'bg-muted text-muted-foreground border-border hover:bg-muted/80'
          }`}
        >
          Recent
        </button>

        {/* Category Filters */}
        {availableCategories.map(category => (
          <button
            key={category}
            onClick={() => onCategoryToggle(category)}
            className={`px-2 py-1 text-xs rounded-full border transition-colors ${
              selectedCategories.includes(category)
                ? 'bg-accent text-accent-foreground border-accent' 
                : 'bg-muted text-muted-foreground border-border hover:bg-muted/80'
            }`}
          >
            {category}
          </button>
        ))}

        {/* Clear All */}
        {hasActiveFilters && (
          <button
            onClick={clearAllFilters}
            className="ml-2 px-2 py-1 text-xs text-destructive hover:text-destructive/80 border border-destructive/20 rounded-full hover:bg-destructive/5 transition-colors"
          >
            Clear All
          </button>
        )}
      </div>

      {/* Active Filters Summary */}
      {hasActiveFilters && (
        <div className="text-sm text-gray-600">
          {searchQuery && (
            <span>Searching "{searchQuery}" • </span>
          )}
          {selectedCategories.length > 0 && (
            <span>{selectedCategories.length} category filter{selectedCategories.length > 1 ? 's' : ''} • </span>
          )}
          {(quickFilters.recent || quickFilters.popular) && (
            <span>
              {[
                quickFilters.popular && 'Popular',
                quickFilters.recent && 'Recent'
              ].filter(Boolean).join(', ')} filter{(quickFilters.recent && quickFilters.popular) ? 's' : ''}
            </span>
          )}
        </div>
      )}
    </div>
  );
};