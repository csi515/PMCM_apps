import { useState } from 'react';
import { Filter, X } from 'lucide-react';

interface FilterOption {
  field: string;
  label: string;
  type: 'text' | 'number' | 'select' | 'date' | 'dateRange';
  options?: { value: string; label: string }[];
}

interface AdvancedFilterProps {
  filters: FilterOption[];
  onApply: (filterValues: Record<string, any>) => void;
  onReset: () => void;
}

function AdvancedFilter({ filters, onApply, onReset }: AdvancedFilterProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [filterValues, setFilterValues] = useState<Record<string, any>>({});

  const handleChange = (field: string, value: any) => {
    setFilterValues(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleApply = () => {
    onApply(filterValues);
    setIsOpen(false);
  };

  const handleReset = () => {
    setFilterValues({});
    onReset();
    setIsOpen(false);
  };

  const activeFilterCount = Object.keys(filterValues).filter(
    key => filterValues[key] !== '' && filterValues[key] !== null && filterValues[key] !== undefined
  ).length;

  return (
    <>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="btn-secondary flex items-center gap-2 relative"
      >
        <Filter className="w-4 h-4" />
        필터
        {activeFilterCount > 0 && (
          <span className="absolute -top-1 -right-1 w-5 h-5 bg-primary-600 text-white text-xs rounded-full flex items-center justify-center">
            {activeFilterCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-medium w-full max-w-2xl p-6 max-h-[80vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-neutral-900">고급 필터</h3>
              <button
                onClick={() => setIsOpen(false)}
                className="p-2 hover:bg-neutral-100 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              {filters.map((filter) => (
                <div key={filter.field}>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    {filter.label}
                  </label>
                  {filter.type === 'text' && (
                    <input
                      type="text"
                      value={filterValues[filter.field] || ''}
                      onChange={(e) => handleChange(filter.field, e.target.value)}
                      className="input-field"
                      placeholder={`${filter.label} 입력...`}
                    />
                  )}
                  {filter.type === 'number' && (
                    <div className="flex gap-2">
                      <input
                        type="number"
                        value={filterValues[`${filter.field}_min`] || ''}
                        onChange={(e) => handleChange(`${filter.field}_min`, e.target.value)}
                        className="input-field flex-1"
                        placeholder="최소값"
                      />
                      <input
                        type="number"
                        value={filterValues[`${filter.field}_max`] || ''}
                        onChange={(e) => handleChange(`${filter.field}_max`, e.target.value)}
                        className="input-field flex-1"
                        placeholder="최대값"
                      />
                    </div>
                  )}
                  {filter.type === 'select' && filter.options && (
                    <select
                      value={filterValues[filter.field] || ''}
                      onChange={(e) => handleChange(filter.field, e.target.value)}
                      className="input-field"
                    >
                      <option value="">전체</option>
                      {filter.options.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  )}
                  {filter.type === 'date' && (
                    <input
                      type="date"
                      value={filterValues[filter.field] || ''}
                      onChange={(e) => handleChange(filter.field, e.target.value)}
                      className="input-field"
                    />
                  )}
                  {filter.type === 'dateRange' && (
                    <div className="flex gap-2">
                      <input
                        type="date"
                        value={filterValues[`${filter.field}_from`] || ''}
                        onChange={(e) => handleChange(`${filter.field}_from`, e.target.value)}
                        className="input-field flex-1"
                        placeholder="시작일"
                      />
                      <input
                        type="date"
                        value={filterValues[`${filter.field}_to`] || ''}
                        onChange={(e) => handleChange(`${filter.field}_to`, e.target.value)}
                        className="input-field flex-1"
                        placeholder="종료일"
                      />
                    </div>
                  )}
                </div>
              ))}
            </div>

            <div className="flex gap-3 mt-6 pt-4 border-t border-neutral-200">
              <button onClick={handleApply} className="btn-primary flex-1">
                적용
              </button>
              <button onClick={handleReset} className="btn-secondary flex-1">
                초기화
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default AdvancedFilter;

