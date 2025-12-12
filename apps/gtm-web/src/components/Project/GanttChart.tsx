import { useEffect, useRef } from 'react';
import { gantt } from 'dhtmlx-gantt';
import 'dhtmlx-gantt/codebase/dhtmlxgantt.css';

interface GanttChartProps {
    projectId: number;
}

function GanttChart({ projectId }: GanttChartProps) {
    const ganttContainer = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!ganttContainer.current) return;

        // Gantt Configuration
        gantt.config.date_format = "%Y-%m-%d %H:%i";
        gantt.config.row_height = 40;
        gantt.config.min_column_width = 40;
        gantt.config.duration_unit = "day";
        gantt.config.scale_height = 50;

        // Define columns
        gantt.config.columns = [
            { name: "text", label: "Task Name", tree: true, width: 250, resize: true },
            { name: "start_date", label: "Start", align: "center", width: 100 },
            { name: "duration", label: "Days", align: "center", width: 60 },
            { name: "add", width: 40 }
        ];

        // Initialize Gantt
        gantt.init(ganttContainer.current);

        // Mock Data Loading (Replace with real data transformation later)
        // Ideally, we transform `projects` or fetch tasks from API here
        const tasks = {
            data: [
                { id: 1, text: "Initial Planning", start_date: "2024-01-01", duration: 7, progress: 0.6, open: true },
                { id: 2, text: "Requirements Analysis", start_date: "2024-01-08", duration: 5, progress: 0.4, parent: 1 },
                { id: 3, text: "Design Phase", start_date: "2024-01-15", duration: 14, progress: 0.1 },
            ],
            links: [
                { id: 1, source: 1, target: 2, type: "0" },
                { id: 2, source: 2, target: 3, type: "0" }
            ]
        };

        gantt.parse(tasks);

        // Cleanup
        return () => {
            gantt.clearAll();
        };
    }, [projectId]);

    return (
        <div className="h-[600px] w-full rounded-xl overflow-hidden border border-neutral-200 shadow-soft bg-white">
            <div ref={ganttContainer} className="w-full h-full" />
        </div>
    );
}

export default GanttChart;
