import { useApp } from '../../contexts/AppContext';

function AuditTrail() {
  const { auditTrail, users } = useApp();

  const getUserName = (userId: number) => {
    const user = users.find(u => u.id === userId);
    return user?.name || '알 수 없음';
  };

  const getActionType = (type: string) => {
    const types: Record<string, string> = {
      'DFMEA_CREATE': 'DFMEA 생성',
      'DFMEA_UPDATE': 'DFMEA 수정',
      'DFMEA_DELETE': 'DFMEA 삭제',
      'PPAP_APPROVAL': 'PPAP 승인',
      'ECR_APPROVAL': 'ECR 승인',
      'ECR_REJECTION': 'ECR 반려',
      'ECR_CREATE': 'ECR 생성',
    };
    return types[type] || type;
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-neutral-900 mb-2">감사 이력</h2>
        <p className="text-neutral-600">시스템 내 주요 데이터 변경 이력</p>
      </div>

      <div className="table-container">
        <table className="w-full">
          <thead className="table-header">
            <tr>
              <th className="text-left text-sm font-semibold text-neutral-700">시간</th>
              <th className="text-left text-sm font-semibold text-neutral-700">작업자</th>
              <th className="text-left text-sm font-semibold text-neutral-700">작업 유형</th>
              <th className="text-left text-sm font-semibold text-neutral-700">작업</th>
              <th className="text-left text-sm font-semibold text-neutral-700">대상 ID</th>
            </tr>
          </thead>
          <tbody>
            {auditTrail.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-6 py-8 text-center text-neutral-500">
                  기록된 감사 이력이 없습니다.
                </td>
              </tr>
            ) : (
              auditTrail
                .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
                .map((item) => (
                  <tr key={item.id} className="table-row">
                    <td className="px-6 py-4 text-sm text-neutral-600">
                      {new Date(item.timestamp).toLocaleString('ko-KR')}
                    </td>
                    <td className="px-6 py-4 text-sm text-neutral-900">
                      {getUserName(item.userId)}
                    </td>
                    <td className="px-6 py-4 text-sm text-neutral-600">
                      {getActionType(item.type)}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`badge ${
                        item.action === 'created' ? 'badge-success' :
                        item.action === 'updated' ? 'badge-info' :
                        item.action === 'deleted' ? 'badge-danger' :
                        item.action === 'approved' ? 'badge-success' :
                        item.action === 'rejected' ? 'badge-danger' : 'badge-info'
                      }`}>
                        {item.action === 'created' ? '생성' :
                         item.action === 'updated' ? '수정' :
                         item.action === 'deleted' ? '삭제' :
                         item.action === 'approved' ? '승인' :
                         item.action === 'rejected' ? '반려' : item.action}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-neutral-600">
                      #{item.entityId}
                    </td>
                  </tr>
                ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default AuditTrail;

