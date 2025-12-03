import { useState } from 'react';
import { useApp } from '../../contexts/AppContext';
import { History, Eye, RotateCcw, User, Clock } from 'lucide-react';
import { format } from 'date-fns';

interface VersionHistoryViewerProps {
  entityType: 'DFMEA' | 'PFMEA' | 'PPAP' | 'ECR';
  entityId: number;
}

function VersionHistoryViewer({ entityType, entityId }: VersionHistoryViewerProps) {
  const { versionHistory, users } = useApp();
  const [selectedVersion, setSelectedVersion] = useState<number | null>(null);

  const entityVersions = versionHistory
    .filter(v => v.entityType === entityType && v.entityId === entityId)
    .sort((a, b) => b.version - a.version);

  const getUserName = (userId: number) => {
    const user = users.find(u => u.id === userId);
    return user?.name || '알 수 없음';
  };

  const handleRestore = (version: typeof entityVersions[0]) => {
    if (window.confirm(`버전 ${version.version}으로 복원하시겠습니까?`)) {
      // 복원 로직은 AppContext에 구현 필요
      alert('복원 기능은 구현 중입니다.');
    }
  };

  if (entityVersions.length === 0) {
    return (
      <div className="card">
        <div className="flex items-center gap-2 mb-4">
          <History className="w-5 h-5 text-neutral-600" />
          <h3 className="text-lg font-semibold text-neutral-900">버전 이력</h3>
        </div>
        <p className="text-neutral-500 text-center py-8">변경 이력이 없습니다.</p>
      </div>
    );
  }

  return (
    <div className="card">
      <div className="flex items-center gap-2 mb-4">
        <History className="w-5 h-5 text-neutral-600" />
        <h3 className="text-lg font-semibold text-neutral-900">버전 이력</h3>
        <span className="text-sm text-neutral-500">({entityVersions.length}개 버전)</span>
      </div>

      <div className="space-y-3">
        {entityVersions.map((version) => (
          <div
            key={version.id}
            className={`p-4 rounded-lg border ${
              selectedVersion === version.id
                ? 'border-primary-500 bg-primary-50'
                : 'border-neutral-200 hover:border-neutral-300'
            } cursor-pointer transition-colors`}
            onClick={() => setSelectedVersion(selectedVersion === version.id ? null : version.id)}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center">
                  <span className="text-primary-600 font-semibold">v{version.version}</span>
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-neutral-900">
                      버전 {version.version}
                    </span>
                    {version.changeDescription && (
                      <span className="text-sm text-neutral-600">
                        - {version.changeDescription}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-4 mt-1 text-xs text-neutral-500">
                    <div className="flex items-center gap-1">
                      <User className="w-3 h-3" />
                      {getUserName(version.changedBy)}
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {format(new Date(version.changedAt), 'yyyy-MM-dd HH:mm')}
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleRestore(version);
                  }}
                  className="p-2 text-neutral-600 hover:text-primary-600 hover:bg-primary-50 rounded-lg"
                  title="이 버전으로 복원"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
              </div>
            </div>

            {selectedVersion === version.id && (
              <div className="mt-4 pt-4 border-t border-neutral-200">
                <h4 className="text-sm font-medium text-neutral-700 mb-2">변경 내용</h4>
                <div className="bg-neutral-50 rounded-lg p-3 text-sm">
                  <pre className="whitespace-pre-wrap text-neutral-700">
                    {JSON.stringify(version.data, null, 2)}
                  </pre>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default VersionHistoryViewer;

