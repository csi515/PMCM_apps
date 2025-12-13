import { useState } from 'react';
import {
    AppShell,
    PageHeader,
    Button,
    Badge,
    Card,
    DataTable,
    FormInput,
    FormSelect,
    Modal,
    ConfirmModal
} from '@repo/ui';
import { Sidebar } from '@repo/ui';
import { Plus, Filter, MoreHorizontal } from 'lucide-react';

export default function RndDemoPage() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isConfirmOpen, setIsConfirmOpen] = useState(false);
    const [filter, setFilter] = useState('');

    const breadcrumbs = [
        { label: '홈', href: '/' },
        { label: '연구개발', href: '/rnd' },
        { label: '과제 관리', href: '/rnd/projects' },
    ];

    const columns = [
        { label: '과제명', key: 'title', width: '30%' },
        { label: '코드', key: 'code', width: '15%' },
        { label: '담당자', key: 'owner', width: '15%' },
        {
            label: '상태', key: 'status', width: '15%',
            render: (item: any) => {
                const variants: Record<string, "success" | "warning" | "neutral" | "danger" | "default" | "info"> = {
                    '진행중': 'success',
                    '검토중': 'warning',
                    '대기': 'neutral',
                    '반려': 'danger',
                    '완료': 'info'
                };
                return <Badge variant={variants[item.status] || 'default'}>{item.status}</Badge>;
            }
        },
        { label: '진척률', key: 'progress', width: '15%' },
        {
            label: '관리', key: 'actions', width: '10%',
            render: () => <Button variant="ghost" size="icon"><MoreHorizontal className="h-4 w-4" /></Button>
        }
    ];

    const data = [
        { id: 1, title: '차세대 배터리 소재 개발', code: 'RND-24-001', owner: '김연구', status: '진행중', progress: '45%' },
        { id: 2, title: 'AI 기반 공정 최적화', code: 'RND-24-002', owner: '이수석', status: '검토중', progress: '80%' },
        { id: 3, title: '친환경 포장재 연구', code: 'RND-24-003', owner: '박책임', status: '대기', progress: '0%' },
        { id: 4, title: '구형 설비 개선', code: 'RND-24-004', owner: '최선임', status: '반려', progress: '100%' },
        { id: 5, title: '신규 촉매 합성', code: 'RND-24-005', owner: '정연구', status: '완료', progress: '100%' },
    ];

    return (
        <AppShell
            sidebar={<div className="p-4"><Sidebar /></div>}
            header={
                <div className="h-14 flex items-center px-6 border-b border-neutral-200">
                    <span className="font-bold text-lg text-brand-600">PMCM Apps</span>
                </div>
            }
        >
            <PageHeader
                title="과제 관리"
                description="진행 중인 모든 R&D 과제를 관리합니다."
                breadcrumbs={breadcrumbs}
                action={
                    <div className="flex gap-2">
                        <Button variant="secondary" onClick={() => setIsConfirmOpen(true)}>
                            <Filter className="mr-2 h-4 w-4" /> 필터
                        </Button>
                        <Button onClick={() => setIsModalOpen(true)}>
                            <Plus className="mr-2 h-4 w-4" />
                            신규 과제 등록
                        </Button>
                    </div>
                }
            >
                <div className="flex gap-4 mt-4 bg-white p-4 rounded-lg border border-neutral-200 shadow-sm">
                    <div className="flex-1 grid grid-cols-4 gap-4">
                        <div className="bg-brand-50 p-4 rounded-md border border-brand-100">
                            <div className="text-sm text-brand-600 font-medium mb-1">진행중 과제</div>
                            <div className="text-2xl font-bold text-brand-700">12</div>
                        </div>
                        <div className="bg-warning-50 p-4 rounded-md border border-warning-100">
                            <div className="text-sm text-warning-600 font-medium mb-1">검토 대기</div>
                            <div className="text-2xl font-bold text-warning-700">3</div>
                        </div>
                        <div className="bg-success-50 p-4 rounded-md border border-success-100">
                            <div className="text-sm text-success-600 font-medium mb-1">완료(금월)</div>
                            <div className="text-2xl font-bold text-success-700">5</div>
                        </div>
                        <div className="bg-error-50 p-4 rounded-md border border-error-100">
                            <div className="text-sm text-error-600 font-medium mb-1">지연됨</div>
                            <div className="text-2xl font-bold text-error-700">1</div>
                        </div>
                    </div>
                </div>
            </PageHeader>

            <div className="space-y-6">
                <Card className="p-4 space-y-4">
                    <div className="flex items-center justify-between">
                        <h3 className="text-lg font-semibold text-neutral-900">과제 목록</h3>
                        <div className="w-72">
                            <FormInput
                                label=""
                                placeholder="과제명, 코드 또는 담당자 검색"
                                value={filter}
                                onChange={(e) => setFilter(e.target.value)}
                                containerClassName="mb-0"
                            />
                        </div>
                    </div>

                    <DataTable
                        columns={columns}
                        data={data}
                    />
                </Card>
            </div>

            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title="신규 과제 등록"
                size="lg"
            >
                <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <FormInput label="과제명" placeholder="과제명을 입력하세요" required />
                        <FormInput label="과제 코드" placeholder="자동 생성됨" disabled value="RND-24-006" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <FormSelect
                            label="담당부서"
                            options={[
                                { value: 'rnd1', label: '선행연구팀' },
                                { value: 'rnd2', label: '공정개발팀' }
                            ]}
                        />
                        <FormInput label="책임자" placeholder="이름을 입력하세요" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <FormInput label="시작일" type="date" />
                        <FormInput label="종료일" type="date" />
                    </div>
                    <FormInput label="예산" type="number" placeholder="0" hint="단위: 만원" />
                </div>
                <div className="mt-6 flex justify-end gap-2">
                    <Button variant="secondary" onClick={() => setIsModalOpen(false)}>취소</Button>
                    <Button onClick={() => setIsModalOpen(false)}>등록</Button>
                </div>
            </Modal>

            <ConfirmModal
                isOpen={isConfirmOpen}
                onClose={() => setIsConfirmOpen(false)}
                onConfirm={() => setIsConfirmOpen(false)}
                title="필터 초기화"
                message="적용된 모든 필터 조건을 초기화하시겠습니까?"
                confirmText="초기화"
                variant="danger"
            />
        </AppShell>
    );
}
