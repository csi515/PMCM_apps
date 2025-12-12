import { ArrowRight } from 'lucide-react';

interface Process {
  id: number;
  name: string;
  description: string;
}

function ProcessFlow() {
  const processes: Process[] = [
    { id: 1, name: '재료 준비', description: '원자재 검수 및 준비' },
    { id: 2, name: '가공', description: 'CNC 가공 공정' },
    { id: 3, name: '조립', description: '부품 조립' },
    { id: 4, name: '검사', description: '최종 검사' },
    { id: 5, name: '포장', description: '포장 및 출하' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-neutral-900 mb-2">공정 흐름도</h2>
        <p className="text-neutral-600">제조 공정의 흐름을 시각화</p>
      </div>

      <div className="card">
        <div className="flex items-center justify-center gap-4 overflow-x-auto py-8">
          {processes.map((process, index) => (
            <div key={process.id} className="flex items-center">
              <div className="bg-white border-2 border-primary-300 rounded-xl p-6 min-w-[200px] text-center shadow-soft">
                <div className="text-lg font-semibold text-neutral-900 mb-2">
                  {process.name}
                </div>
                <div className="text-sm text-neutral-600">
                  {process.description}
                </div>
              </div>
              {index < processes.length - 1 && (
                <ArrowRight className="w-6 h-6 text-primary-600 mx-2" />
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default ProcessFlow;

