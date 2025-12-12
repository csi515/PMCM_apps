import { useState } from 'react';
import { CheckSquare, Square, MoreVertical } from 'lucide-react';

interface BulkActionsProps {
  selectedItems: number[];
  onSelectAll: () => void;
  onDeselectAll: () => void;
  onBulkAction: (action: string, itemIds: number[]) => void;
  totalItems: number;
  actions?: Array<{ label: string; value: string; icon?: React.ReactNode }>;
}

function BulkActions({
  selectedItems,
  onSelectAll,
  onDeselectAll,
  onBulkAction,
  totalItems,
  actions = [
    { label: '상태 변경', value: 'statusChange' },
    { label: '담당자 할당', value: 'assign' },
    { label: '삭제', value: 'delete' },
  ],
}: BulkActionsProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const allSelected = selectedItems.length === totalItems && totalItems > 0;

  const handleSelectAll = () => {
    if (allSelected) {
      onDeselectAll();
    } else {
      onSelectAll();
    }
  };

  return (
    <div className="flex items-center justify-between p-4 bg-neutral-50 border border-neutral-200 rounded-lg">
      <div className="flex items-center gap-4">
        <button
          onClick={handleSelectAll}
          className="flex items-center gap-2 text-sm font-medium text-neutral-700 hover:text-neutral-900"
        >
          {allSelected ? (
            <CheckSquare className="w-5 h-5 text-primary-600" />
          ) : (
            <Square className="w-5 h-5 text-neutral-400" />
          )}
          전체 선택
        </button>
        {selectedItems.length > 0 && (
          <span className="text-sm text-neutral-600">
            {selectedItems.length}개 항목 선택됨
          </span>
        )}
      </div>

      {selectedItems.length > 0 && (
        <div className="relative">
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="btn-secondary flex items-center gap-2"
          >
            <MoreVertical className="w-4 h-4" />
            일괄 작업
          </button>

          {isMenuOpen && (
            <>
              <div
                className="fixed inset-0 z-10"
                onClick={() => setIsMenuOpen(false)}
              />
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-medium border border-neutral-200 z-20">
                {actions.map((action) => (
                  <button
                    key={action.value}
                    onClick={() => {
                      onBulkAction(action.value, selectedItems);
                      setIsMenuOpen(false);
                    }}
                    className="w-full text-left px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-50 first:rounded-t-lg last:rounded-b-lg"
                  >
                    {action.label}
                  </button>
                ))}
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}

export default BulkActions;

