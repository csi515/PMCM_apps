import { Calendar, Clock, ArrowRight } from 'lucide-react';
import { useApp } from '@repo/ui';
import { format } from 'date-fns';

function ProjectTimelineWidget() {
    const { projects } = useApp();

    // Filter active projects
    const activeProjects = projects.filter(p => p.status === '진행중' || p.status === 'In Progress').slice(0, 3);

    return (
        <div className="card h-full">
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-50 rounded-lg">
                        <Calendar className="w-5 h-5 text-blue-600" />
                    </div>
                    <h3 className="text-lg font-bold text-neutral-900">Active Projects</h3>
                </div>
                <button className="text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors">
                    View Gantt
                </button>
            </div>

            <div className="space-y-4">
                {activeProjects.map(project => (
                    <div key={project.id} className="group relative pl-6 pb-2 border-l-2 border-neutral-100 last:border-0">
                        <div className="absolute left-[-5px] top-0 w-2.5 h-2.5 rounded-full bg-blue-500 ring-4 ring-white"></div>

                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-3 rounded-lg hover:bg-neutral-50 transition-colors cursor-pointer" onClick={() => window.location.href = `/projects/${project.id}`}>
                            <div>
                                <h4 className="font-semibold text-neutral-900 group-hover:text-blue-600 transition-colors">{project.name}</h4>
                                <div className="flex items-center text-xs text-neutral-500 mt-1">
                                    <Clock className="w-3.5 h-3.5 mr-1" />
                                    {format(new Date(project.startDate), 'MMM d')} - {format(new Date(project.endDate), 'MMM d, yyyy')}
                                </div>
                            </div>

                            <div className="flex items-center gap-3">
                                <div className="text-right">
                                    <span className="block text-xs font-semibold text-neutral-500 uppercase">Phase {project.currentPhase}</span>
                                    <span className="block text-sm font-bold text-neutral-900">{project.progress}%</span>
                                </div>
                                <button className="p-1.5 text-neutral-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                                    <ArrowRight className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
                {activeProjects.length === 0 && (
                    <div className="text-center py-8 text-neutral-500 text-sm">
                        No active projects found.
                    </div>
                )}
            </div>
        </div>
    );
}

export default ProjectTimelineWidget;
