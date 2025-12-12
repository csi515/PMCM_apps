import GoalAlignmentWidget from './GoalAlignmentWidget';
import ProjectTimelineWidget from './ProjectTimelineWidget';
import WeeklyReportWidget from './WeeklyReportWidget';

function Dashboard() {

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-neutral-900 font-display">Dashboard</h2>
          <p className="text-neutral-500 mt-1">Overview of your goals and projects</p>
        </div>
        <div className="text-sm text-neutral-500 font-medium bg-white px-4 py-2 rounded-xl shadow-sm border border-neutral-100">
          Last updated: Today, 09:41 AM
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-full">
        {/* Left Column: Goals & Reports (2/3 width on large screens) */}
        <div className="lg:col-span-2 space-y-6">
          {/* Goal Alignment Section */}
          <GoalAlignmentWidget />

          {/* Project Timeline Section */}
          <ProjectTimelineWidget />
        </div>

        {/* Right Column: Weekly Report & Quick Actions (1/3 width) */}
        <div className="space-y-6">
          <WeeklyReportWidget />

          {/* Quick Actions Card */}
          <div className="card">
            <h3 className="text-lg font-bold text-neutral-900 mb-4">Quick Actions</h3>
            <div className="space-y-2">
              <button className="w-full text-left p-3 rounded-lg hover:bg-neutral-50 transition-colors flex items-center justify-between group">
                <span className="text-sm font-medium text-neutral-700 group-hover:text-primary-600">New Project Task</span>
                <span className="text-neutral-400 group-hover:text-primary-600">+</span>
              </button>
              <button className="w-full text-left p-3 rounded-lg hover:bg-neutral-50 transition-colors flex items-center justify-between group">
                <span className="text-sm font-medium text-neutral-700 group-hover:text-primary-600">Register KPI</span>
                <span className="text-neutral-400 group-hover:text-primary-600">+</span>
              </button>
              <button className="w-full text-left p-3 rounded-lg hover:bg-neutral-50 transition-colors flex items-center justify-between group">
                <span className="text-sm font-medium text-neutral-700 group-hover:text-primary-600">Schedule Meeting</span>
                <span className="text-neutral-400 group-hover:text-primary-600">+</span>
              </button>
            </div>
          </div>

          {/* System Notice */}
          <div className="bg-neutral-900 rounded-2xl p-6 text-white text-center">
            <h4 className="font-bold mb-2">System Maintenance</h4>
            <p className="text-xs text-neutral-400 mb-4">Scheduled for Dec 15, 02:00 AM - 04:00 AM (local time)</p>
            <button className="text-xs font-bold text-white bg-white/20 hover:bg-white/30 px-4 py-2 rounded-lg transition-colors w-full">
              Details
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;

