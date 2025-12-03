import React, { ReactNode } from 'react';

interface Column<T> {
  key: string;
  label: string;
  render?: (item: T, index: number) => ReactNode;
  align?: 'left' | 'center' | 'right';
  className?: string;
}

interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  emptyMessage?: string;
  emptyIcon?: ReactNode;
  onRowClick?: (item: T) => void;
  className?: string;
  rowClassName?: (item: T, index: number) => string;
}

function DataTable<T extends { id?: number | string }>({
  columns,
  data,
  emptyMessage = '등록된 데이터가 없습니다.',
  emptyIcon,
  onRowClick,
  className = '',
  rowClassName,
}: DataTableProps<T>) {
  const getAlignmentClass = (align?: 'left' | 'center' | 'right') => {
    switch (align) {
      case 'center':
        return 'text-center';
      case 'right':
        return 'text-right';
      default:
        return 'text-left';
    }
  };

  if (data.length === 0) {
    return (
      <div className="table-container">
        <div className="px-6 py-12 text-center text-neutral-500">
          {emptyIcon}
          <p className="mt-2">{emptyMessage}</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`table-container overflow-x-auto ${className}`}>
      <table className="w-full">
        <thead className="table-header">
          <tr>
            {columns.map((column) => (
              <th
                key={column.key}
                className={`${getAlignmentClass(column.align)} text-sm font-semibold text-neutral-700 ${column.className || ''}`}
              >
                {column.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((item, index) => (
            <tr
              key={item.id || index}
              className={`table-row ${rowClassName ? rowClassName(item, index) : ''} ${onRowClick ? 'cursor-pointer hover:bg-neutral-50' : ''}`}
              onClick={() => onRowClick?.(item)}
            >
              {columns.map((column) => (
                <td
                  key={column.key}
                  className={`px-6 py-4 text-sm ${getAlignmentClass(column.align)} ${column.className || ''}`}
                >
                  {column.render
                    ? column.render(item, index)
                    : (item as any)[column.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default DataTable;

