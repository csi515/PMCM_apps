import { Users, User, FolderOpen, Globe, Filter } from 'lucide-react';
import { DataVisibility } from '../../types';

interface DataVisibilityFilterProps {
  value: 'all' | DataVisibility;
  onChange: (value: 'all' | DataVisibility) => void;
  showAll?: boolean;
}

function DataVisibilityFilter({ value, onChange, showAll = true }: DataVisibilityFilterProps) {
  const options: Array<{ value: 'all' | DataVisibility; label: string; icon: typeof Users }> = [
    ...(showAll ? [{ value: 'all' as const, label: '전체', icon: Filter }] : []),
    { value: 'personal', label: '개인', icon: User },
    { value: 'department', label: '부서 공유', icon: Users },
    { value: 'project', label: '프로젝트 공유', icon: FolderOpen },
    { value: 'public', label: '전체 공개', icon: Globe },
  ];

  return (
    <div className="flex items-center gap-2 p-1 bg-neutral-100 rounded-lg">
      {options.map((option) => {
        const Icon = option.icon;
        return (
          <button
            key={option.value}
            onClick={() => onChange(option.value)}
            className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              value === option.value
                ? 'bg-white text-primary-700 shadow-sm'
                : 'text-neutral-600 hover:text-neutral-900 hover:bg-neutral-50'
            }`}
          >
            <Icon className="w-4 h-4" />
            {option.label}
          </button>
        );
      })}
    </div>
  );
}

export default DataVisibilityFilter;

