import { useState } from 'react';
import { Upload, Download, Plus, Trash2 } from 'lucide-react';
import { useApp } from '../../contexts/AppContext';
import { SPCData } from '../../types';
import { generateMESData } from '../../utils/mesSimulator';
import { parseExcelFile } from '../../utils/excelParser';
import { calculateCpk, calculatePpk, calculateXbarR } from '../../utils/calculations';
import { Line } from 'react-chartjs-2';
import { xbarRChartOptions, chartColors } from '../../utils/chartConfig';

function SPCAnalysis() {
  const { spcDataNew, addSPCData, currentUser } = useApp();
  const [localSpcData, setLocalSpcData] = useState<SPCData[]>([]);
  const [usl, setUsl] = useState(105);
  const [lsl, setLsl] = useState(95);
  const [target, setTarget] = useState(100);
  const [formData, setFormData] = useState({
    process: '',
    value: 0,
    lot: '',
    batch: '',
  });

  // 로컬 데이터와 Context 데이터 병합
  const allSpcData = [...spcDataNew, ...localSpcData];

  const handleMESLoad = () => {
    const mesData = generateMESData('공정 A', 25);
    // MES 데이터를 SPCData 형식으로 변환
    const convertedData: SPCData[] = mesData.map((item, index) => ({
      id: Date.now() + index,
      process: item.process,
      value: item.value,
      timestamp: item.timestamp,
      lot: `LOT-${String(Math.floor(index / 5) + 1).padStart(3, '0')}`,
      batch: `BATCH-${String((index % 5) + 1).padStart(2, '0')}`,
      projectId: 1,
    }));
    setLocalSpcData(convertedData);
  };

  const handleExcelUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        const data = await parseExcelFile(file);
        // Excel 데이터를 SPCData 형식으로 변환
        const convertedData: SPCData[] = data.map((item: any, index: number) => ({
          id: Date.now() + index,
          process: item.process || '공정 A',
          value: item.value || 0,
          timestamp: item.timestamp || new Date().toISOString(),
          lot: item.lot || '',
          batch: item.batch || '',
          projectId: 1,
        }));
        setLocalSpcData(convertedData);
      } catch (error) {
        alert('Excel 파일 파싱 중 오류가 발생했습니다.');
        console.error(error);
      }
    }
  };

  const handleAddData = () => {
    if (!formData.process || formData.value === 0) {
      alert('공정과 측정값을 입력해주세요.');
      return;
    }

    const newData: Omit<SPCData, 'id'> = {
      process: formData.process,
      value: formData.value,
      timestamp: new Date().toISOString(),
      lot: formData.lot || undefined,
      batch: formData.batch || undefined,
      projectId: 1,
    };

    addSPCData(newData);
    setFormData({ process: '', value: 0, lot: '', batch: '' });
  };

  const handleDeleteLocalData = (id: number) => {
    setLocalSpcData(localSpcData.filter(item => item.id !== id));
  };

  const values = allSpcData.map(d => d.value);
  const cpk = values.length > 0 ? calculateCpk(values, usl, lsl, target) : 0;
  const ppk = values.length > 0 ? calculatePpk(values, usl, lsl) : 0;
  const xbarRData = allSpcData.length > 0 ? calculateXbarR(allSpcData.map(item => ({
    id: item.id,
    process: item.process,
    value: item.value,
    timestamp: item.timestamp,
  }))) : [];

  // Chart.js용 데이터 준비
  const chartData = {
    labels: xbarRData.map((item) => `샘플 ${item.subgroup}`),
    datasets: [
      {
        label: 'Xbar (평균)',
        data: xbarRData.map((item) => item.xbar),
        borderColor: chartColors.primary,
        backgroundColor: chartColors.primary + '20',
        borderWidth: 2,
        pointRadius: 4,
        pointHoverRadius: 6,
        fill: false,
      },
      {
        label: 'UCL (상한관리선)',
        data: xbarRData.map(() => target + 3 * (usl - lsl) / 6),
        borderColor: chartColors.danger,
        borderWidth: 2,
        borderDash: [5, 5],
        pointRadius: 0,
        fill: false,
      },
      {
        label: 'LCL (하한관리선)',
        data: xbarRData.map(() => target - 3 * (usl - lsl) / 6),
        borderColor: chartColors.danger,
        borderWidth: 2,
        borderDash: [5, 5],
        pointRadius: 0,
        fill: false,
      },
      {
        label: 'Center (목표값)',
        data: xbarRData.map(() => target),
        borderColor: chartColors.info,
        borderWidth: 2,
        borderDash: [3, 3],
        pointRadius: 0,
        fill: false,
      },
    ],
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-neutral-900 mb-2">SPC 분석</h2>
          <p className="text-neutral-600">통계적 공정 관리 및 공정 능력 분석</p>
        </div>
        <div className="flex gap-3">
          <button onClick={handleMESLoad} className="btn-primary flex items-center gap-2">
            <Download className="w-4 h-4" />
            MES 데이터 가져오기
          </button>
          <label className="btn-secondary flex items-center gap-2 cursor-pointer">
            <Upload className="w-4 h-4" />
            Excel 업로드
            <input
              type="file"
              accept=".xlsx,.xls"
              onChange={handleExcelUpload}
              className="hidden"
            />
          </label>
        </div>
      </div>

      {/* 규격 설정 */}
      <div className="card">
        <h3 className="text-lg font-semibold text-neutral-900 mb-4">규격 설정</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-2">상한 (USL)</label>
            <input
              type="number"
              value={usl}
              onChange={(e) => setUsl(parseFloat(e.target.value) || 0)}
              className="input-field"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-2">목표값 (Target)</label>
            <input
              type="number"
              value={target}
              onChange={(e) => setTarget(parseFloat(e.target.value) || 0)}
              className="input-field"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-2">하한 (LSL)</label>
            <input
              type="number"
              value={lsl}
              onChange={(e) => setLsl(parseFloat(e.target.value) || 0)}
              className="input-field"
            />
          </div>
        </div>
      </div>

      {/* 데이터 입력 폼 */}
      <div className="card">
        <h3 className="text-lg font-semibold text-neutral-900 mb-4">데이터 입력</h3>
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-2">공정 *</label>
            <input
              type="text"
              value={formData.process}
              onChange={(e) => setFormData({ ...formData, process: e.target.value })}
              className="input-field"
              placeholder="공정명"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-2">측정값 *</label>
            <input
              type="number"
              step="0.01"
              value={formData.value || ''}
              onChange={(e) => setFormData({ ...formData, value: parseFloat(e.target.value) || 0 })}
              className="input-field"
              placeholder="측정값"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-2">Lot</label>
            <input
              type="text"
              value={formData.lot}
              onChange={(e) => setFormData({ ...formData, lot: e.target.value })}
              className="input-field"
              placeholder="Lot 번호"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-2">Batch</label>
            <input
              type="text"
              value={formData.batch}
              onChange={(e) => setFormData({ ...formData, batch: e.target.value })}
              className="input-field"
              placeholder="Batch 번호"
            />
          </div>
          <div className="flex items-end">
            <button onClick={handleAddData} className="btn-primary w-full flex items-center justify-center gap-2">
              <Plus className="w-4 h-4" />
              추가
            </button>
          </div>
        </div>
      </div>

      {/* 공정 능력 지수 */}
      {allSpcData.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="card">
            <h3 className="text-lg font-semibold text-neutral-900 mb-4">공정 능력 지수</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-neutral-50 rounded-lg">
                <span className="text-sm font-medium text-neutral-700">Cpk</span>
                <span className={`text-2xl font-bold ${cpk >= 1.33 ? 'text-green-600' : 'text-red-600'}`}>
                  {cpk.toFixed(2)}
                </span>
              </div>
              <div className="flex items-center justify-between p-4 bg-neutral-50 rounded-lg">
                <span className="text-sm font-medium text-neutral-700">Ppk</span>
                <span className={`text-2xl font-bold ${ppk >= 1.33 ? 'text-green-600' : 'text-red-600'}`}>
                  {ppk.toFixed(2)}
                </span>
              </div>
            </div>
          </div>

          <div className="card">
            <h3 className="text-lg font-semibold text-neutral-900 mb-4">판정</h3>
            <div className="space-y-2">
              <div className={`p-4 rounded-lg ${cpk >= 1.33 ? 'bg-green-50' : 'bg-red-50'}`}>
                <div className="text-sm font-medium text-neutral-700 mb-1">Cpk 판정</div>
                <div className={`text-lg font-semibold ${cpk >= 1.33 ? 'text-green-700' : 'text-red-700'}`}>
                  {cpk >= 1.33 ? '합격' : '불합격'}
                </div>
              </div>
              <div className={`p-4 rounded-lg ${ppk >= 1.33 ? 'bg-green-50' : 'bg-red-50'}`}>
                <div className="text-sm font-medium text-neutral-700 mb-1">Ppk 판정</div>
                <div className={`text-lg font-semibold ${ppk >= 1.33 ? 'text-green-700' : 'text-red-700'}`}>
                  {ppk >= 1.33 ? '합격' : '불합격'}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Xbar-R 관리도 */}
      {allSpcData.length > 0 && (
        <div className="card">
          <h3 className="text-lg font-semibold text-neutral-900 mb-4">Xbar-R 관리도</h3>
          <div style={{ height: '300px' }}>
            <Line data={chartData} options={xbarRChartOptions} />
          </div>
        </div>
      )}

      {/* 데이터 테이블 */}
      {allSpcData.length > 0 && (
        <div className="table-container overflow-x-auto">
          <table className="w-full min-w-[800px]">
            <thead className="table-header">
              <tr>
                <th className="text-left text-sm font-semibold text-neutral-700">번호</th>
                <th className="text-left text-sm font-semibold text-neutral-700">공정</th>
                <th className="text-right text-sm font-semibold text-neutral-700">측정값</th>
                <th className="text-left text-sm font-semibold text-neutral-700">Lot</th>
                <th className="text-left text-sm font-semibold text-neutral-700">Batch</th>
                <th className="text-left text-sm font-semibold text-neutral-700">시간</th>
                <th className="text-right text-sm font-semibold text-neutral-700">작업</th>
              </tr>
            </thead>
            <tbody>
              {allSpcData.map((item) => (
                <tr key={item.id} className="table-row">
                  <td className="px-6 py-4 text-sm text-neutral-900">{item.id}</td>
                  <td className="px-6 py-4 text-sm text-neutral-600">{item.process}</td>
                  <td className="px-6 py-4 text-sm text-right font-medium">{item.value.toFixed(2)}</td>
                  <td className="px-6 py-4 text-sm text-neutral-600">{item.lot || '-'}</td>
                  <td className="px-6 py-4 text-sm text-neutral-600">{item.batch || '-'}</td>
                  <td className="px-6 py-4 text-sm text-neutral-600">
                    {new Date(item.timestamp).toLocaleString('ko-KR')}
                  </td>
                  <td className="px-6 py-4">
                    {localSpcData.some(d => d.id === item.id) && (
                      <button
                        onClick={() => handleDeleteLocalData(item.id)}
                        className="p-2 text-neutral-600 hover:text-red-600 hover:bg-red-50 rounded-lg"
                        title="삭제"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {allSpcData.length === 0 && (
        <div className="card text-center py-12">
          <p className="text-neutral-500">MES 데이터를 가져오거나 Excel 파일을 업로드하거나 직접 데이터를 입력하세요.</p>
        </div>
      )}
    </div>
  );
}

export default SPCAnalysis;

