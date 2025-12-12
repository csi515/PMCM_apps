import { useParams } from 'react-router-dom';
import { useApp } from '@repo/ui';
import GanttChart from './GanttChart';
import { Layers, Calendar, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

function ProjectDetail() {
    const { id } = useParams<{ id: string }>();
    const { projects } = useApp();
    const projectId = Number(id);
    const project = projects.find((p: any) => p.id === projectId);

    if (!project) {
        return <div className="p-8 text-center text-neutral-500">Project not found</div>;
    }

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            <div className="flex items-center gap-4">
                <Link to="/dashboard" className="p-2 hover:bg-neutral-100 rounded-lg transition-colors">
                    <ArrowLeft className="w-5 h-5 text-neutral-600" />
                </Link>
                <div>
                    <h1 className="text-2xl font-bold text-neutral-900 font-display flex items-center gap-2">
                        {project.name}
                        <span className="text-xs font-medium px-2.5 py-0.5 rounded-full bg-primary-100 text-primary-700">
                            {project.status}
                        </span>
                    </h1>
                    <p className="text-sm text-neutral-500 flex items-center gap-4 mt-1">
                        <span className="flex items-center gap-1"><Layers className="w-4 h-4" /> Phase {project.currentPhase}</span>
                        <span className="flex items-center gap-1"><Calendar className="w-4 h-4" /> {project.startDate} ~ {project.endDate}</span>
                    </p>
                </div>
            </div>

            <div className="card p-0 overflow-hidden">
                <div className="p-4 border-b border-neutral-100 flex items-center justify-between bg-neutral-50/50">
                    <h3 className="font-bold text-neutral-800">Project Schedule (Gantt)</h3>
                    <div className="flex gap-2">
                        <button className="px-3 py-1.5 text-xs font-medium bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors">
                            Save Changes
                        </button>
                        <button className="px-3 py-1.5 text-xs font-medium bg-white border border-neutral-300 rounded-lg hover:bg-neutral-50 transition-colors">
                            Export PDF
                        </button>
                    </div>
                </div>
                <div className="p-4">
                    <GanttChart projectId={projectId} />
                </div>
            </div>
        </div>
    );
}

export default ProjectDetail;
