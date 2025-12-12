import { ChevronRight } from 'lucide-react';
import { Card } from '@repo/ui';

function GoalAlignmentWidget() {
    // Mock data for goals (ideally this comes from useApp or API)
    const goals = [
        {
            id: 1,
            title: 'FY24 전사 품질 혁신',
            progress: 75,
            children: [
                { id: 2, title: '고객 컴플레인 50% 감소', progress: 80 },
                { id: 3, title: '공정 불량률 10ppm 달성', progress: 60 },
            ]
        },
        {
            id: 4,
            title: '신제품 개발 리드타임 단축',
            progress: 40,
            children: [
                { id: 5, title: '설계 검증 기간 단축', progress: 100 },
                { id: 6, title: '시작 금형 제작 최적화', progress: 20 },
            ]
        }
    ];

    return (
        <Card
            className="h-full"
            title="Goal Alignment"
            action={
                <button className="text-sm font-medium text-indigo-600 hover:text-indigo-700 transition-colors">
                    View All
                </button>
            }
        >

            <div className="space-y-4">
                {goals.map(goal => (
                    <div key={goal.id} className="p-4 bg-neutral-50 rounded-xl border border-neutral-100 hover:border-indigo-100 hover:shadow-sm transition-all duration-200">
                        <div className="flex items-center justify-between mb-3">
                            <span className="font-semibold text-neutral-900">{goal.title}</span>
                            <span className={`text-xs font-bold px-2 py-1 rounded-full ${goal.progress >= 70 ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>
                                {goal.progress}%
                            </span>
                        </div>

                        <div className="w-full bg-neutral-200 rounded-full h-2 mb-4">
                            <div
                                className={`h-2 rounded-full transition-all duration-500 ${goal.progress >= 70 ? 'bg-green-500' : 'bg-amber-500'}`}
                                style={{ width: `${goal.progress}%` }}
                            />
                        </div>

                        <div className="space-y-2 pl-4 border-l-2 border-neutral-200">
                            {goal.children.map(child => (
                                <div key={child.id} className="flex items-center text-sm text-neutral-600">
                                    <ChevronRight className="w-4 h-4 mr-1 text-neutral-400" />
                                    <span className="flex-1">{child.title}</span>
                                    <span className="font-medium text-neutral-800">{child.progress}%</span>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </Card>
    );
}

export default GoalAlignmentWidget;
