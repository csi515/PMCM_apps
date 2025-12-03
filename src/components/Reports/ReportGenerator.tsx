import { useState } from 'react';
import { useApp } from '../../contexts/AppContext';
import { FileDown, FileText, BarChart3 } from 'lucide-react';
import { exportToExcel, generateFMEAReport, generateStatisticsReport } from '../../utils/reportGenerator';

function ReportGenerator() {
  const { dfmea, projects, users } = useApp();
  const [selectedReport, setSelectedReport] = useState<string>('');
  const [selectedProject, setSelectedProject] = useState<number>(1);

  const handleExportDFMEA = (format: 'excel' | 'pdf') => {
    const project = projects.find(p => p.id === selectedProject);
    const projectName = project?.name || 'Unknown';

    if (format === 'excel') {
      const excelData = dfmea.map(item => ({
        '고장모드': item.failureMode,
        '영향': item.effect,
        '원인': item.cause,
        '심각도(S)': item.severity,
        '발생도(O)': item.occurrence,
        '탐지도(D)': item.detection,
        'RPN': item.rpn,
        '상태': item.status,
        '담당자': users.find(u => u.id === item.assignedTo)?.name || '-',
        '파일 링크': item.fileLink || '-',
      }));
      exportToExcel(excelData, `DFMEA_${projectName}_${Date.now()}`, 'DFMEA');
    } else {
      generateFMEAReport(dfmea, projectName);
    }
  };

  const handleExportStatistics = () => {
    const stats = {
      totalItems: dfmea.length,
      highRPN: dfmea.filter(item => item.rpn > 100).length,
      averageRPN: dfmea.length > 0
        ? dfmea.reduce((sum, item) => sum + item.rpn, 0) / dfmea.length
        : 0,
      statusBreakdown: dfmea.reduce((acc, item) => {
        acc[item.status] = (acc[item.status] || 0) + 1;
        return acc;
      }, {} as Record<string, number>),
    };
    generateStatisticsReport(stats, `Statistics_Report_${Date.now()}`);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-neutral-900 mb-2">보고서 생성</h2>
        <p className="text-neutral-600">데이터를 Excel 또는 PDF 형식으로 내보내기</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* DFMEA 보고서 */}
        <div className="card">
          <div className="flex items-center gap-2 mb-4">
            <FileText className="w-5 h-5 text-primary-600" />
            <h3 className="text-lg font-semibold text-neutral-900">DFMEA 보고서</h3>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                프로젝트 선택
              </label>
              <select
                value={selectedProject}
                onChange={(e) => setSelectedProject(parseInt(e.target.value))}
                className="input-field"
              >
                {projects.map((project) => (
                  <option key={project.id} value={project.id}>
                    {project.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => handleExportDFMEA('excel')}
                className="btn-primary flex items-center gap-2 flex-1"
              >
                <FileDown className="w-4 h-4" />
                Excel 내보내기
              </button>
              <button
                onClick={() => handleExportDFMEA('pdf')}
                className="btn-secondary flex items-center gap-2 flex-1"
              >
                <FileText className="w-4 h-4" />
                PDF 생성
              </button>
            </div>
          </div>
        </div>

        {/* 통계 보고서 */}
        <div className="card">
          <div className="flex items-center gap-2 mb-4">
            <BarChart3 className="w-5 h-5 text-primary-600" />
            <h3 className="text-lg font-semibold text-neutral-900">통계 보고서</h3>
          </div>
          
          <div className="space-y-4">
            <p className="text-sm text-neutral-600">
              전체 FMEA 데이터의 통계 분석 보고서를 생성합니다.
            </p>
            <button
              onClick={handleExportStatistics}
              className="btn-primary flex items-center gap-2 w-full"
            >
              <FileText className="w-4 h-4" />
              PDF 통계 보고서 생성
            </button>
          </div>
        </div>
      </div>

      {/* 통계 요약 */}
      <div className="card">
        <h3 className="text-lg font-semibold text-neutral-900 mb-4">현재 통계 요약</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="p-4 bg-primary-50 rounded-lg">
            <div className="text-sm text-neutral-600">전체 항목</div>
            <div className="text-2xl font-bold text-primary-600 mt-1">{dfmea.length}</div>
          </div>
          <div className="p-4 bg-yellow-50 rounded-lg">
            <div className="text-sm text-neutral-600">고위험 항목 (RPN &gt; 100)</div>
            <div className="text-2xl font-bold text-yellow-600 mt-1">
              {dfmea.filter(item => item.rpn > 100).length}
            </div>
          </div>
          <div className="p-4 bg-green-50 rounded-lg">
            <div className="text-sm text-neutral-600">평균 RPN</div>
            <div className="text-2xl font-bold text-green-600 mt-1">
              {dfmea.length > 0
                ? (dfmea.reduce((sum, item) => sum + item.rpn, 0) / dfmea.length).toFixed(1)
                : '0'}
            </div>
          </div>
          <div className="p-4 bg-blue-50 rounded-lg">
            <div className="text-sm text-neutral-600">승인 완료</div>
            <div className="text-2xl font-bold text-blue-600 mt-1">
              {dfmea.filter(item => item.status === 'approved').length}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ReportGenerator;

