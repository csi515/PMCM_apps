import { FileText, Plus, History } from 'lucide-react';

function WeeklyReportWidget() {
    const currentWeek = 42; // This should be calculated dynamically
    const isSubmitted = false; // Mock status

    return (
        <div className="card bg-gradient-to-br from-indigo-600 to-indigo-800 text-white border-none shadow-lg shadow-indigo-900/20">
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-white/10 rounded-lg backdrop-blur-sm">
                        <FileText className="w-5 h-5 text-white" />
                    </div>
                    <div>
                        <h3 className="text-lg font-bold">Weekly Report</h3>
                        <p className="text-xs text-indigo-200">Week {currentWeek}, 2024</p>
                    </div>
                </div>
                <div className={`px-3 py-1 rounded-full text-xs font-bold border ${isSubmitted ? 'bg-green-500/20 border-green-400/30 text-green-100' : 'bg-amber-500/20 border-amber-400/30 text-amber-100'}`}>
                    {isSubmitted ? 'Submitted' : 'Pending Draft'}
                </div>
            </div>

            <div className="mb-6">
                <p className="text-sm text-indigo-100 leading-relaxed">
                    {isSubmitted
                        ? "Great job! Your weekly report for this week has been submitted successfully."
                        : "You haven't submitted your weekly report yet. Create a draft based on your recent activities."
                    }
                </p>
            </div>

            <div className="grid grid-cols-2 gap-3">
                <button
                    onClick={() => window.location.href = '/reports/weekly'}
                    className="flex items-center justify-center gap-2 py-2.5 px-4 bg-white text-indigo-700 rounded-lg font-bold text-sm hover:bg-indigo-50 transition-colors shadow-sm"
                >
                    {isSubmitted ? (
                        <>
                            <FileText className="w-4 h-4" /> View Report
                        </>
                    ) : (
                        <>
                            <Plus className="w-4 h-4" /> Create Draft
                        </>
                    )}
                </button>
                <button className="flex items-center justify-center gap-2 py-2.5 px-4 bg-indigo-700/50 text-white border border-indigo-500/30 rounded-lg font-medium text-sm hover:bg-indigo-700/70 transition-colors">
                    <History className="w-4 h-4" /> History
                </button>
            </div>
        </div>
    );
}

export default WeeklyReportWidget;
