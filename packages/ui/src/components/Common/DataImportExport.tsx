import { useState } from 'react';
import { useApp } from '../../contexts/AppContext';
import { Upload, Download, FileSpreadsheet } from 'lucide-react';
import * as XLSX from 'xlsx';
import { exportToExcel } from '../../utils/reportGenerator';

function DataImportExport() {
  const { dfmea, addDFMEA, users } = useApp();
  const [importStatus, setImportStatus] = useState<string>('');

  const handleExport = () => {
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
    exportToExcel(excelData, `DFMEA_Export_${Date.now()}`, 'DFMEA');
    setImportStatus('데이터가 성공적으로 내보내졌습니다.');
  };

  const handleImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target?.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: 'array' });
        const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
        const jsonData = XLSX.utils.sheet_to_json(firstSheet);

        let importedCount = 0;
        jsonData.forEach((row: any) => {
          const rpn = (row['심각도(S)'] || row['S'] || 1) * 
                     (row['발생도(O)'] || row['O'] || 1) * 
                     (row['탐지도(D)'] || row['D'] || 1);
          
          addDFMEA({
            failureMode: row['고장모드'] || row['Failure Mode'] || '',
            effect: row['영향'] || row['Effect'] || '',
            cause: row['원인'] || row['Cause'] || '',
            severity: row['심각도(S)'] || row['S'] || 1,
            occurrence: row['발생도(O)'] || row['O'] || 1,
            detection: row['탐지도(D)'] || row['D'] || 1,
            rpn,
            fileLink: row['파일 링크'] || row['File Link'] || '',
            status: 'draft',
            projectId: 1,
          });
          importedCount++;
        });

        setImportStatus(`${importedCount}개의 항목이 성공적으로 가져왔습니다.`);
      } catch (error) {
        setImportStatus('파일을 읽는 중 오류가 발생했습니다.');
        console.error(error);
      }
    };
    reader.readAsArrayBuffer(file);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-neutral-900 mb-2">데이터 가져오기/내보내기</h2>
        <p className="text-neutral-600">Excel 파일로 데이터를 가져오거나 내보내기</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* 내보내기 */}
        <div className="card">
          <div className="flex items-center gap-2 mb-4">
            <Download className="w-5 h-5 text-primary-600" />
            <h3 className="text-lg font-semibold text-neutral-900">데이터 내보내기</h3>
          </div>
          <p className="text-sm text-neutral-600 mb-4">
            현재 DFMEA 데이터를 Excel 형식으로 내보냅니다.
          </p>
          <button onClick={handleExport} className="btn-primary flex items-center gap-2 w-full">
            <FileSpreadsheet className="w-4 h-4" />
            Excel로 내보내기
          </button>
        </div>

        {/* 가져오기 */}
        <div className="card">
          <div className="flex items-center gap-2 mb-4">
            <Upload className="w-5 h-5 text-primary-600" />
            <h3 className="text-lg font-semibold text-neutral-900">데이터 가져오기</h3>
          </div>
          <p className="text-sm text-neutral-600 mb-4">
            Excel 파일에서 DFMEA 데이터를 가져옵니다.
          </p>
          <label className="btn-primary flex items-center gap-2 w-full cursor-pointer">
            <Upload className="w-4 h-4" />
            Excel 파일 선택
            <input
              type="file"
              accept=".xlsx,.xls"
              onChange={handleImport}
              className="hidden"
            />
          </label>
          <p className="text-xs text-neutral-500 mt-2">
            지원 형식: .xlsx, .xls
          </p>
        </div>
      </div>

      {importStatus && (
        <div className={`card ${
          importStatus.includes('오류') ? 'bg-red-50 border-red-200' : 'bg-green-50 border-green-200'
        }`}>
          <p className={importStatus.includes('오류') ? 'text-red-700' : 'text-green-700'}>
            {importStatus}
          </p>
        </div>
      )}
    </div>
  );
}

export default DataImportExport;

