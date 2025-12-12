import { useState } from 'react';
import {
    DndContext,
    DragOverlay,
    closestCorners,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
    DragStartEvent,
    DragOverEvent,
    defaultDropAnimationSideEffects,
    DropAnimation
} from '@dnd-kit/core';
import {
    SortableContext,
    sortableKeyboardCoordinates,
    verticalListSortingStrategy,
    useSortable
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Plus, GripVertical, AlertCircle, Clock, CheckCircle2 } from 'lucide-react';
import { Avatar } from '@repo/ui';

// Data Types
type TaskStatus = 'Ready' | 'InProgress' | 'Done' | 'Delayed';

interface Task {
    id: string;
    title: string;
    status: TaskStatus;
    assignee: string;
    priority: 'High' | 'Medium' | 'Low';
}

const COLUMNS: { id: TaskStatus; title: string; color: string }[] = [
    { id: 'Ready', title: 'To Do', color: 'bg-neutral-100 text-neutral-600' },
    { id: 'InProgress', title: 'In Progress', color: 'bg-blue-100 text-blue-700' },
    { id: 'Done', title: 'Done', color: 'bg-green-100 text-green-700' },
    { id: 'Delayed', title: 'Delayed', color: 'bg-red-100 text-red-700' },
];

// Sortable Item Component
function SortableItem({ id, task }: { id: string; task: Task }) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging
    } = useSortable({ id: id, data: { task } });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : 1,
    };

    return (
        <div
            ref={setNodeRef}
            style={style}
            {...attributes}
            {...listeners}
            className="card p-3 shadow-sm hover:shadow-md transition-shadow relative group cursor-grab active:cursor-grabbing bg-white border border-neutral-200"
        >
            <div className="flex items-start justify-between">
                <h4 className="font-medium text-neutral-800 text-sm leading-snug mb-2 pr-4">{task.title}</h4>
                <div className={`w-2 h-2 rounded-full ${task.priority === 'High' ? 'bg-red-500' :
                    task.priority === 'Medium' ? 'bg-amber-500' : 'bg-green-500'
                    }`} />
            </div>
            <div className="flex item-center justify-between text-xs text-neutral-500 mt-2">
                <div className="flex items-center gap-1">
                    <Avatar name={task.assignee} size="sm" className="text-[10px] w-5 h-5" />
                    <span>{task.assignee}</span>
                </div>
                <GripVertical className="w-4 h-4 text-neutral-300 opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
        </div>
    );
}

// Column Component
function Column({ id, title, color, tasks }: { id: TaskStatus; title: string; color: string; tasks: Task[] }) {
    const { setNodeRef } = useSortable({ id: id, data: { type: 'column' } });

    return (
        <div className="flex flex-col h-full bg-neutral-50/50 rounded-xl border border-neutral-200/60 overflow-hidden">
            <div className={`p-3 font-semibold text-sm flex items-center justify-between border-b border-neutral-200 ${color} bg-opacity-30`}>
                <span className="flex items-center gap-2">
                    {id === 'Delayed' && <AlertCircle className="w-4 h-4" />}
                    {id === 'Done' && <CheckCircle2 className="w-4 h-4" />}
                    {id === 'InProgress' && <Clock className="w-4 h-4" />}
                    {title}
                </span>
                <span className="bg-white/50 px-2 py-0.5 rounded text-xs font-bold">{tasks.length}</span>
            </div>
            <div ref={setNodeRef} className="flex-1 p-3 space-y-3 overflow-y-auto min-h-[150px]">
                <SortableContext items={tasks.map(t => t.id)} strategy={verticalListSortingStrategy}>
                    {tasks.map(task => (
                        <SortableItem key={task.id} id={task.id} task={task} />
                    ))}
                </SortableContext>
                {tasks.length === 0 && (
                    <div className="h-full flex items-center justify-center text-neutral-400 text-sm italic border-2 border-dashed border-neutral-100 rounded-lg">
                        Empty
                    </div>
                )}
            </div>
            <div className="p-3 pt-0">
                <button className="w-full py-2 text-xs font-medium text-neutral-500 hover:text-neutral-700 hover:bg-neutral-100 rounded-lg border border-transparent hover:border-neutral-200 transition-all flex items-center justify-center gap-1">
                    <Plus className="w-3 h-3" /> Add Task
                </button>
            </div>
        </div>
    );
}

export default function KanbanBoard() {
    const [tasks, setTasks] = useState<Task[]>([
        { id: '1', title: 'Define Project Scope', status: 'Done', assignee: 'Alice', priority: 'High' },
        { id: '2', title: 'Design Database Schema', status: 'Done', assignee: 'Bob', priority: 'High' },
        { id: '3', title: 'Gantt Chart Implementation', status: 'InProgress', assignee: 'Charlie', priority: 'Medium' },
        { id: '4', title: 'Weekly Report Automation', status: 'InProgress', assignee: 'Alice', priority: 'Medium' },
        { id: '5', title: 'User Acceptance Testing', status: 'Ready', assignee: 'Dave', priority: 'High' },
        { id: '6', title: 'Deployment to Production', status: 'Ready', assignee: 'Eve', priority: 'Critical' } as any,
        { id: '7', title: 'Fix API Latency', status: 'Delayed', assignee: 'Bob', priority: 'High' },
    ]);

    const [activeId, setActiveId] = useState<string | null>(null);

    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    const findContainer = (id: string): TaskStatus | undefined => {
        if (tasks.find(t => t.id === id)) {
            return tasks.find(t => t.id === id)?.status;
        }
        return undefined; // Columns themselves are not sortable in this minimal version, so we care about tasks
    };

    const handleDragStart = (event: DragStartEvent) => {
        const { active } = event;
        setActiveId(active.id as string);
    };

    const handleDragOver = (event: DragOverEvent) => {
        const { active, over } = event;
        const overId = over?.id;

        if (!overId || active.id === overId) return;

        const activeContainer = findContainer(active.id as string);
        // If dropping over a column container directly (we need to map column IDs correctly)
        // OR dropping over another task
        const overContainer = (COLUMNS.find(c => c.id === overId) ? overId : findContainer(overId as string)) as TaskStatus;

        if (!activeContainer || !overContainer || activeContainer === overContainer) {
            return;
        }

        // If moving between columns, update immediately for smoother UI
        setTasks((prev) => {
            return prev.map(t => {
                if (t.id === active.id) {
                    return { ...t, status: overContainer };
                }
                return t;
            });
        });
    };

    // For final reordering within the same column or final drop
    const handleDragEnd = () => {
        setActiveId(null);
    };

    const dropAnimation: DropAnimation = {
        sideEffects: defaultDropAnimationSideEffects({
            styles: {
                active: {
                    opacity: '0.5',
                },
            },
        }),
    };

    return (
        <div className="h-[calc(100vh-100px)] flex flex-col animate-in fade-in duration-500">
            <div className="flex items-center justify-between mb-6 px-1">
                <div>
                    <h1 className="text-2xl font-bold text-neutral-900 font-display">Department Status Board</h1>
                    <p className="text-sm text-neutral-500">Manage tasks and workflow across the department.</p>
                </div>
                <div className="flex gap-2">
                    <button className="px-4 py-2 bg-white border border-neutral-300 rounded-lg text-sm font-medium hover:bg-neutral-50 transition-colors">
                        Filter by Assignee
                    </button>
                    <button className="px-4 py-2 bg-primary-600 text-white rounded-lg text-sm font-medium hover:bg-primary-700 transition-colors shadow-lg shadow-primary-600/20">
                        Create Task
                    </button>
                </div>
            </div>

            <DndContext
                sensors={sensors}
                collisionDetection={closestCorners}
                onDragStart={handleDragStart}
                onDragOver={handleDragOver}
                onDragEnd={handleDragEnd}
            >
                <div className="flex gap-6 h-full overflow-x-auto pb-4">
                    {COLUMNS.map(col => (
                        <div key={col.id} className="flex-shrink-0 w-80">
                            <Column
                                id={col.id}
                                title={col.title}
                                color={col.color}
                                tasks={tasks.filter(t => t.status === col.id)}
                            />
                        </div>
                    ))}
                </div>
                <DragOverlay dropAnimation={dropAnimation}>
                    {activeId ? (
                        <div className="card p-3 shadow-xl ring-2 ring-indigo-500/20 rotate-2 bg-white cursor-grabbing">
                            <h4 className="font-medium text-neutral-800 text-sm mb-2">{tasks.find(t => t.id === activeId)?.title}</h4>
                        </div>
                    ) : null}
                </DragOverlay>
            </DndContext>
        </div>
    );
}
