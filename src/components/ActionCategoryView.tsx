import React, { useState } from 'react';
import { ChevronRight, ChevronDown, Package, Search, Filter, X } from 'lucide-react';

interface ActionCategory {
  name: string;
  icon: React.ReactNode;
  count: number;
  actions: any[];
  description: string;
}

interface ActionCategoryViewProps {
  categories: ActionCategory[];
  selectedActions: string[];
  onActionToggle: (actionType: string) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  quickFilters: { recent: boolean; popular: boolean; };
  onQuickFilterToggle: (filter: 'recent' | 'popular') => void;
}

export const ActionCategoryView: React.FC<ActionCategoryViewProps> = ({
  categories,
  selectedActions,
  onActionToggle,
  searchQuery,
  onSearchChange,
  quickFilters,
  onQuickFilterToggle
}) => {
  const [viewMode, setViewMode] = useState<'all' | 'category'>('all');
  const [selectedCategoryFilters, setSelectedCategoryFilters] = useState<string[]>([]);
  const [expandedCategories, setExpandedCategories] = useState<string[]>(['Communication']);

  const toggleCategoryFilter = (categoryName: string) => {
    setSelectedCategoryFilters(prev =>
      prev.includes(categoryName)
        ? prev.filter(c => c !== categoryName)
        : [...prev, categoryName]
    );
  };

  const toggleCategory = (categoryName: string) => {
    setExpandedCategories(prev =>
      prev.includes(categoryName)
        ? prev.filter(c => c !== categoryName)
        : [...prev, categoryName]
    );
  };

  const clearAllFilters = () => {
    onSearchChange('');
    setSelectedCategoryFilters([]);
    if (quickFilters.recent) onQuickFilterToggle('recent');
    if (quickFilters.popular) onQuickFilterToggle('popular');
  };

  const allActions = categories.flatMap(cat => cat.actions);
  
  const filteredActions = allActions.filter(action => {
    const matchesSearch = !searchQuery || 
      action.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
      action.description.toLowerCase().includes(searchQuery.toLowerCase());
      
    const matchesCategory = selectedCategoryFilters.length === 0 || 
      selectedCategoryFilters.includes(action.category);
      
    const matchesQuickFilter = (!quickFilters.popular && !quickFilters.recent) ||
      (quickFilters.popular && ['send_email', 'create_ticket', 'assign_review'].includes(action.type)) ||
      (quickFilters.recent && ['send_notification', 'move_document'].includes(action.type));
      
    return matchesSearch && matchesCategory && matchesQuickFilter;
  });

  const filteredCategories = categories.map(category => ({
    ...category,
    actions: category.actions.filter(action => {
      const matchesSearch = !searchQuery || 
        action.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
        action.description.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesFilter = selectedCategoryFilters.length === 0 || 
        selectedCategoryFilters.includes(category.name);
        
      return matchesSearch && matchesFilter;
    })
  })).filter(category => category.actions.length > 0);

  return (
    <div className="space-y-4">
      {/* View Mode Toggle */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setViewMode('all')}
            className={`px-3 py-1 text-xs rounded-full border transition-colors ${
              viewMode === 'all'
                ? 'bg-[hsl(var(--color-accent-blue))] text-white border-[hsl(var(--color-accent-blue))]'
                : 'bg-muted text-muted-foreground border-border hover:bg-muted/80'
            }`}
          >
            All Actions
          </button>
          <button
            onClick={() => setViewMode('category')}
            className={`px-3 py-1 text-xs rounded-full border transition-colors ${
              viewMode === 'category'
                ? 'bg-[hsl(var(--color-accent-blue))] text-white border-[hsl(var(--color-accent-blue))]'
                : 'bg-muted text-muted-foreground border-border hover:bg-muted/80'
            }`}
          >
            <Package className="w-3 h-3 mr-1 inline" />
            By Category
          </button>
        </div>

        {/* Search */}
        <div className="relative w-64">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <input
            type="text"
            placeholder="Search actions..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-input rounded-lg bg-background text-sm focus:ring-2 focus:ring-ring focus:border-transparent"
          />
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-2">
        <div className="flex items-center gap-1 text-sm font-medium text-muted-foreground">
          <Filter className="w-4 h-4" />
          Filters:
        </div>

        {viewMode === 'all' ? (
          // Show quick filters for All Actions view
          <>
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
          </>
        ) : (
          // Show category filters for By Category view
          categories.map(category => (
            <button
              key={category.name}
              onClick={() => toggleCategoryFilter(category.name)}
              className={`px-2 py-1 text-xs rounded-full border transition-colors ${
                selectedCategoryFilters.includes(category.name)
                  ? 'bg-accent text-accent-foreground border-accent' 
                  : 'bg-muted text-muted-foreground border-border hover:bg-muted/80'
              }`}
            >
              {category.name}
            </button>
          ))
        )}

        {/* Clear All */}
        {(searchQuery || selectedCategoryFilters.length > 0 || quickFilters.recent || quickFilters.popular) && (
          <button
            onClick={clearAllFilters}
            className="ml-2 px-2 py-1 text-xs text-destructive hover:text-destructive/80 border border-destructive/20 rounded-full hover:bg-destructive/5 transition-colors"
          >
            Clear All
          </button>
        )}
      </div>

      {/* Category View */}
      {viewMode === 'category' ? (
        <div className="space-y-3">
          {filteredCategories.map((category) => (
            <div key={category.name} className="bg-card border rounded-lg">
              <button
                onClick={() => toggleCategory(category.name)}
                className="w-full flex items-center justify-between p-4 hover:bg-accent/50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="text-muted-foreground">
                    {category.icon}
                  </div>
                  <div className="text-left">
                    <div className="font-medium text-foreground">
                      {category.name}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {category.description} • {category.actions.length} actions
                    </div>
                  </div>
                </div>
                {expandedCategories.includes(category.name) ? (
                  <ChevronDown className="w-4 h-4 text-muted-foreground" />
                ) : (
                  <ChevronRight className="w-4 h-4 text-muted-foreground" />
                )}
              </button>

              {expandedCategories.includes(category.name) && (
                <div className="border-t border-border">
                  <div className="p-2 space-y-1">
                    {category.actions.map((action) => {
                      const isSelected = selectedActions.includes(action.type);
                      return (
                        <button
                          key={action.type}
                          onClick={() => onActionToggle(action.type)}
                          className={`w-full flex items-center gap-3 p-3 rounded hover:bg-accent/50 transition-colors text-left ${
                            isSelected ? 'bg-[hsl(var(--color-accent-blue-bg))] border border-[hsl(var(--color-accent-blue))]/20' : ''
                          }`}
                        >
                          <div className="flex-shrink-0">
                            {React.cloneElement(action.icon as React.ReactElement, { 
                              className: `w-4 h-4 ${isSelected ? 'text-[hsl(var(--color-accent-blue))]' : 'text-muted-foreground'}`
                            })}
                          </div>
                          
                          <div className="flex-1 min-w-0">
                            <div className={`text-sm font-medium truncate ${
                              isSelected ? 'text-[hsl(var(--color-accent-blue))]' : 'text-foreground'
                            }`}>
                              {action.label}
                            </div>
                            <div className="text-xs text-muted-foreground truncate">
                              {action.description}
                            </div>
                          </div>
                          
                          {isSelected && (
                            <div className="flex-shrink-0">
                              <div className="w-5 h-5 bg-[hsl(var(--color-accent-blue))] rounded-full flex items-center justify-center">
                                <div className="w-2 h-2 bg-white rounded-full" />
                              </div>
                            </div>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        /* All Actions List View */
        <div className="bg-card border rounded-lg">
          <div className="p-3 border-b border-border">
            <h4 className="text-sm font-medium text-foreground">All Actions</h4>
            <p className="text-xs text-muted-foreground">
              Showing {filteredActions.length} actions
            </p>
          </div>
          
          <div className="p-2 space-y-1 max-h-96 overflow-y-auto">
            {filteredActions.map((action) => {
              const isSelected = selectedActions.includes(action.type);
              return (
                <button
                  key={action.type}
                  onClick={() => onActionToggle(action.type)}
                  className={`w-full flex items-center gap-3 p-3 rounded hover:bg-accent/50 transition-colors text-left ${
                    isSelected ? 'bg-[hsl(var(--color-accent-blue-bg))] border border-[hsl(var(--color-accent-blue))]/20' : ''
                  }`}
                >
                  <div className="flex-shrink-0">
                    {React.cloneElement(action.icon as React.ReactElement, { 
                      className: `w-4 h-4 ${isSelected ? 'text-[hsl(var(--color-accent-blue))]' : 'text-muted-foreground'}` 
                    })}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className={`text-sm font-medium truncate ${
                      isSelected ? 'text-[hsl(var(--color-accent-blue))]' : 'text-foreground'
                    }`}>
                      {action.label}
                    </div>
                    <div className="text-xs text-muted-foreground truncate">
                      {action.description}
                    </div>
                    <div className="text-xs text-muted-foreground/70 mt-1">
                      {action.category}
                    </div>
                  </div>
                  
                  {isSelected && (
                    <div className="flex-shrink-0">
                      <div className="w-5 h-5 bg-[hsl(var(--color-accent-blue))] rounded-full flex items-center justify-center">
                        <div className="w-2 h-2 bg-white rounded-full" />
                      </div>
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};