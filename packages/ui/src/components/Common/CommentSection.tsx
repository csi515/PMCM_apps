import { useState, FormEvent } from 'react';
import { useApp } from '../../contexts/AppContext';
import { Send, Edit2, Trash2, MessageSquare } from 'lucide-react';

interface CommentSectionProps {
  entityType: 'DFMEA' | 'PFMEA' | 'PPAP' | 'ECR' | 'QUALITY_ISSUE';
  entityId: number;
}

function CommentSection({ entityType, entityId }: CommentSectionProps) {
  const { comments, users, currentUser, addComment, updateComment, deleteComment } = useApp();
  const [newComment, setNewComment] = useState('');
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editContent, setEditContent] = useState('');

  const entityComments = comments
    .filter(c => c.entityType === entityType && c.entityId === entityId)
    .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());

  const getUserName = (userId: number) => {
    const user = users.find(u => u.id === userId);
    return user?.name || '알 수 없음';
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!newComment.trim() || !currentUser?.id) return;

    // @멘션 추출 (간단한 구현)
    const mentionRegex = /@(\w+)/g;
    const mentions: number[] = [];
    let match: RegExpExecArray | null;
    while ((match = mentionRegex.exec(newComment)) !== null) {
      const m = match;
      const mentionedUser = users.find(u => u.name.includes(m[1]));
      if (mentionedUser) {
        mentions.push(mentionedUser.id);
      }
    }

    addComment({
      entityType,
      entityId,
      userId: currentUser.id,
      content: newComment,
      mentions: mentions.length > 0 ? mentions : undefined,
    });

    setNewComment('');
  };

  const handleEdit = (commentId: number, currentContent: string) => {
    setEditingId(commentId);
    setEditContent(currentContent);
  };

  const handleUpdate = (commentId: number) => {
    if (!editContent.trim()) return;
    updateComment(commentId, editContent);
    setEditingId(null);
    setEditContent('');
  };

  const handleDelete = (commentId: number) => {
    if (window.confirm('댓글을 삭제하시겠습니까?')) {
      deleteComment(commentId);
    }
  };

  return (
    <div className="mt-6 border-t border-neutral-200 pt-6">
      <div className="flex items-center gap-2 mb-4">
        <MessageSquare className="w-5 h-5 text-neutral-600" />
        <h4 className="font-medium text-neutral-900">댓글 ({entityComments.length})</h4>
      </div>

      {/* 댓글 목록 */}
      <div className="space-y-4 mb-6">
        {entityComments.map((comment) => (
          <div key={comment.id} className="bg-neutral-50 rounded-lg p-4">
            <div className="flex items-start justify-between mb-2">
              <div>
                <div className="font-medium text-sm text-neutral-900">
                  {getUserName(comment.userId)}
                </div>
                <div className="text-xs text-neutral-500">
                  {new Date(comment.createdAt).toLocaleString('ko-KR')}
                  {comment.updatedAt !== comment.createdAt && ' (수정됨)'}
                </div>
              </div>
              {currentUser?.id === comment.userId && (
                <div className="flex gap-2">
                  {editingId === comment.id ? (
                    <>
                      <button
                        onClick={() => handleUpdate(comment.id)}
                        className="text-xs text-primary-600 hover:text-primary-700"
                      >
                        저장
                      </button>
                      <button
                        onClick={() => {
                          setEditingId(null);
                          setEditContent('');
                        }}
                        className="text-xs text-neutral-600 hover:text-neutral-700"
                      >
                        취소
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        onClick={() => handleEdit(comment.id, comment.content)}
                        className="p-1 text-neutral-600 hover:text-primary-600"
                      >
                        <Edit2 className="w-3 h-3" />
                      </button>
                      <button
                        onClick={() => handleDelete(comment.id)}
                        className="p-1 text-neutral-600 hover:text-red-600"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </>
                  )}
                </div>
              )}
            </div>
            {editingId === comment.id ? (
              <textarea
                value={editContent}
                onChange={(e) => setEditContent(e.target.value)}
                className="input-field w-full"
                rows={3}
              />
            ) : (
              <p className="text-sm text-neutral-700 whitespace-pre-wrap">{comment.content}</p>
            )}
            {comment.mentions && comment.mentions.length > 0 && (
              <div className="mt-2 text-xs text-primary-600">
                멘션: {comment.mentions.map(id => getUserName(id)).join(', ')}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* 댓글 입력 */}
      <form onSubmit={handleSubmit} className="space-y-2">
        <textarea
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="댓글을 입력하세요... (@이름으로 멘션 가능)"
          className="input-field w-full"
          rows={3}
        />
        <div className="flex items-center justify-between">
          <p className="text-xs text-neutral-500">
            @이름을 입력하여 특정 사용자를 멘션할 수 있습니다.
          </p>
          <button
            type="submit"
            className="btn-primary flex items-center gap-2"
            disabled={!newComment.trim()}
          >
            <Send className="w-4 h-4" />
            등록
          </button>
        </div>
      </form>
    </div>
  );
}

export default CommentSection;

