import { useState } from 'react';
import { useApp } from '../../contexts/AppContext';
import { User, UserRole } from '../../types';
import { Plus, Edit, Trash2, Lock } from 'lucide-react';
import Modal from '../Common/Modal';
import ConfirmModal from '../Common/ConfirmModal';
import DataTable from '../Common/DataTable';
import Badge from '../Common/Badge';
import PageHeader from '../Common/PageHeader';
import FormInput from '../Common/FormInput';
import FormSelect from '../Common/FormSelect';

function UserManagement() {
  const { users, addUser, updateUser, deleteUser, currentUser, forceResetPassword } = useApp();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [resetConfirmUser, setResetConfirmUser] = useState<User | null>(null);
  const [formData, setFormData] = useState({
    employeeId: '',
    username: '',
    password: '',
    name: '',
    department: '',
    dept: '',
    position: '',
    role: 'USER' as UserRole,
    isDepartmentHead: false,
    ssnPrefix: '',
    ssnSuffix: '',
  });

  const handleOpenModal = (user: User | null = null) => {
    if (user) {
      setEditingUser(user);
      setFormData({
        employeeId: user.employeeId || '',
        username: user.username || '',
        password: '',
        name: user.name,
        department: user.department || '',
        dept: user.dept || user.department || '',
        position: user.position,
        role: user.role,
        isDepartmentHead: user.isDepartmentHead || false,
        ssnPrefix: user.ssnPrefix || '',
        ssnSuffix: user.ssnSuffix || '',
      });
    } else {
      setEditingUser(null);
      setFormData({
        employeeId: '',
        username: '',
        password: '',
        name: '',
        department: '',
        dept: '',
        position: '',
        role: 'USER',
        isDepartmentHead: false,
        ssnPrefix: '',
        ssnSuffix: '',
      });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingUser(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingUser) {
      updateUser({
        id: editingUser.id,
        ...formData,
        password: formData.password || editingUser.password,
      });
    } else {
      if (!formData.password) {
        alert('비밀번호를 입력해주세요.');
        return;
      }
      if (!formData.employeeId) {
        alert('사번을 입력해주세요.');
        return;
      }
      addUser({
        ...formData,
        department: formData.dept || formData.department,
      });
    }
    
    handleCloseModal();
  };

  const [deleteConfirmUser, setDeleteConfirmUser] = useState<User | null>(null);

  const handleDelete = (userId: number) => {
    const user = users.find(u => u.id === userId);
    if (user) {
      setDeleteConfirmUser(user);
    }
  };

  const confirmDelete = () => {
    if (deleteConfirmUser) {
      deleteUser(deleteConfirmUser.id);
      setDeleteConfirmUser(null);
    }
  };

  const handleForceResetPassword = (user: User) => {
    setResetConfirmUser(user);
  };

  const confirmForceReset = () => {
    if (resetConfirmUser) {
      try {
        forceResetPassword(resetConfirmUser.id);
        alert(`사용자 "${resetConfirmUser.name}"의 비밀번호가 임시 비밀번호(1234)로 재설정되었습니다.`);
        setResetConfirmUser(null);
      } catch (error: any) {
        alert(error.message || '비밀번호 재설정에 실패했습니다.');
      }
    }
  };

  const getRoleBadgeVariant = (role: UserRole): 'danger' | 'warning' | 'info' => {
    switch (role) {
      case 'ADMIN':
        return 'danger';
      case 'APPROVER':
        return 'warning';
      default:
        return 'info';
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="사용자 관리"
        description="시스템 사용자 추가, 수정, 삭제"
        action={
          <button onClick={() => handleOpenModal(null)} className="btn-primary flex items-center gap-2">
            <Plus className="w-4 h-4" />
            사용자 추가
          </button>
        }
      />

      <DataTable
        columns={[
          { key: 'name', label: '이름' },
          {
            key: 'employeeId',
            label: '사번',
            render: (user) => user.employeeId || user.username || '-',
          },
          {
            key: 'dept',
            label: '부서',
            render: (user) => user.dept || user.department,
          },
          { key: 'position', label: '직책' },
          {
            key: 'role',
            label: '권한',
            render: (user) => <Badge variant={getRoleBadgeVariant(user.role)}>{user.role}</Badge>,
          },
          {
            key: 'isDepartmentHead',
            label: '부서장',
            render: (user) =>
              user.isDepartmentHead ? (
                <Badge variant="success">예</Badge>
              ) : (
                <span className="text-neutral-400">-</span>
              ),
          },
          {
            key: 'actions',
            label: '작업',
            align: 'right',
            render: (user) => (
              <div className="flex items-center justify-end gap-2">
                <button
                  onClick={() => handleOpenModal(user)}
                  className="p-2 text-neutral-600 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
                  title="수정"
                >
                  <Edit className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleForceResetPassword(user)}
                  className="p-2 text-neutral-600 hover:text-orange-600 hover:bg-orange-50 rounded-lg transition-colors"
                  title="비밀번호 재설정"
                >
                  <Lock className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDelete(user.id)}
                  className="p-2 text-neutral-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  title="삭제"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ),
          },
        ]}
        data={users}
        emptyMessage="등록된 사용자가 없습니다."
        className="min-w-[1000px]"
      />

      {/* 사용자 추가/수정 모달 */}
      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={editingUser ? '사용자 수정' : '사용자 추가'}
        size="md"
      >

        <form onSubmit={handleSubmit} className="space-y-4">
          <FormInput
            label="사번"
            value={formData.employeeId}
            onChange={(e) => setFormData({ ...formData, employeeId: e.target.value.toUpperCase() })}
            placeholder="예: E001"
            required
          />

          <FormInput
            label="사용자 ID (선택)"
            value={formData.username}
            onChange={(e) => setFormData({ ...formData, username: e.target.value })}
            placeholder="기존 호환성을 위해 유지"
          />

          <FormInput
            label="비밀번호"
            type="password"
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            required={!editingUser}
            placeholder={editingUser ? '변경하지 않으려면 비워두세요' : ''}
            hint={!editingUser ? undefined : '변경하지 않으려면 비워두세요'}
          />

          <FormInput
            label="이름"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
          />

          <FormInput
            label="부서"
            value={formData.dept}
            onChange={(e) => setFormData({ ...formData, dept: e.target.value, department: e.target.value })}
            required
          />

          <FormInput
            label="직책"
            value={formData.position}
            onChange={(e) => setFormData({ ...formData, position: e.target.value })}
            required
          />

          <FormSelect
            label="권한"
            value={formData.role}
            onChange={(e) => setFormData({ ...formData, role: e.target.value as UserRole })}
            options={[
              { value: 'USER', label: 'USER' },
              { value: 'APPROVER', label: 'APPROVER' },
              { value: 'ADMIN', label: 'ADMIN' },
            ]}
            required
          />

          <FormInput
            label="주민등록번호 앞자리 (로그인용)"
            value={formData.ssnPrefix}
            onChange={(e) => setFormData({ ...formData, ssnPrefix: e.target.value.replace(/\D/g, '').slice(0, 6) })}
            placeholder="6자리 (예: 900101)"
            maxLength={6}
            hint="로그인 시 사용됩니다"
          />

          <FormInput
            label="주민등록번호 뒷자리 (비밀번호 재설정용)"
            value={formData.ssnSuffix}
            onChange={(e) => setFormData({ ...formData, ssnSuffix: e.target.value.replace(/\D/g, '').slice(0, 7) })}
            placeholder="7자리 (예: 1234567)"
            maxLength={7}
            hint="비밀번호 재설정 시 사용됩니다"
          />

          <div className="flex items-center">
                <input
                  type="checkbox"
                  id="isDepartmentHead"
                  checked={formData.isDepartmentHead}
                  onChange={(e) => setFormData({ ...formData, isDepartmentHead: e.target.checked })}
                  className="w-4 h-4 text-primary-600 border-neutral-300 rounded focus:ring-primary-500"
                />
                <label htmlFor="isDepartmentHead" className="ml-2 text-sm text-neutral-700">
                  부서장으로 지정
                </label>
              </div>

              <div className="flex gap-3 pt-4">
                <button type="submit" className="btn-primary flex-1">
                  {editingUser ? '수정' : '추가'}
                </button>
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="btn-secondary flex-1"
                >
                  취소
                </button>
              </div>
            </form>
      </Modal>

      {/* 비밀번호 강제 재설정 확인 모달 */}
      <ConfirmModal
        isOpen={!!resetConfirmUser}
        onClose={() => setResetConfirmUser(null)}
        onConfirm={confirmForceReset}
        title="비밀번호 재설정 확인"
        message={
          resetConfirmUser
            ? `사용자 "${resetConfirmUser.name}"의 비밀번호를 임시 비밀번호 "1234"로 재설정하시겠습니까?\n\n사용자는 다음 로그인 시 임시 비밀번호로 로그인한 후 비밀번호를 변경해야 합니다.`
            : ''
        }
        confirmText="재설정"
        variant="warning"
      />

      {/* 삭제 확인 모달 */}
      <ConfirmModal
        isOpen={!!deleteConfirmUser}
        onClose={() => setDeleteConfirmUser(null)}
        onConfirm={confirmDelete}
        title="사용자 삭제 확인"
        message={
          deleteConfirmUser
            ? `사용자 "${deleteConfirmUser.name}"을(를) 정말 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.`
            : ''
        }
        confirmText="삭제"
        variant="danger"
      />
    </div>
  );
}

export default UserManagement;

