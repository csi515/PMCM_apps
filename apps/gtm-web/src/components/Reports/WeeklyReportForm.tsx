import { useState } from 'react';
import { useApp } from '@repo/ui';
import { Save, Wand2, Globe, ArrowLeft, Send } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

function WeeklyReportForm() {
    const navigate = useNavigate();
    const { currentUser } = useApp();
    const [showJapanese, setShowJapanese] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Form State
    const [formData, setFormData] = useState({
        achievements: '',
        achievementsJa: '',
        plans: '',
        plansJa: '',
        issues: '',
        issuesJa: ''
    });

    // Mock "Smart Draft" Logic
    const handleSmartDraft = () => {
        // In a real scenario, this would fetch completed tasks from the API
        const draftAchievements = `[System Generated]
- Completed refactoring of GTM Dashboard widgets.
- Implemented Interactive Gantt Chart with dhtmlx-gantt.
- Finalized database schema for Weekly Reports.`;

        const draftPlans = `[System Generated]
- Implement Kanban Board for Department view.
- Verify user authentication for Multi-App switching.
- Prepare deployment guide.`;

        setFormData(prev => ({
            ...prev,
            achievements: draftAchievements,
            plans: draftPlans
        }));
    };

    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async () => {
        setIsSubmitting(true);
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        alert('Weekly Report Submitted Successfully!');
        setIsSubmitting(false);
        navigate('/dashboard');
    };

    return (
        <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in duration-500">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Link to="/dashboard" className="p-2 hover:bg-neutral-100 rounded-lg transition-colors">
                        <ArrowLeft className="w-5 h-5 text-neutral-600" />
                    </Link>
                    <div>
                        <h1 className="text-2xl font-bold text-neutral-900 font-display">Weekly Report</h1>
                        <p className="text-sm text-neutral-500">Week 42, 2024 • {currentUser?.name}</p>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <button
                        onClick={() => setShowJapanese(!showJapanese)}
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg border text-sm font-medium transition-colors ${showJapanese
                            ? 'bg-indigo-50 border-indigo-200 text-indigo-700'
                            : 'bg-white border-neutral-300 text-neutral-700 hover:bg-neutral-50'
                            }`}
                    >
                        <Globe className="w-4 h-4" />
                        {showJapanese ? 'Hide JA Input' : '🇯🇵 Add JA Input'}
                    </button>
                    <button
                        onClick={handleSmartDraft}
                        className="flex items-center gap-2 px-4 py-2 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-lg text-sm font-medium hover:bg-emerald-100 transition-colors"
                    >
                        <Wand2 className="w-4 h-4" />
                        Smart Draft
                    </button>
                </div>
            </div>

            {/* Form */}
            <div className="card space-y-8 p-8">
                {/* Achievement Section */}
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <h3 className="text-lg font-bold text-neutral-800">This Week Achievements (금주 실적)</h3>
                        <span className="text-xs text-neutral-400">Summarize your completed tasks</span>
                    </div>
                    <textarea
                        name="achievements"
                        value={formData.achievements}
                        onChange={handleChange}
                        className="input-field min-h-[120px]"
                        placeholder="- Task A completed&#10;- Fixed issue B"
                    />
                    {showJapanese && (
                        <div className="relative animate-in slide-in-from-top-2 duration-200">
                            <span className="absolute top-3 right-3 text-xs font-bold text-indigo-300">🇯🇵 Japanese</span>
                            <textarea
                                name="achievementsJa"
                                value={formData.achievementsJa}
                                onChange={handleChange}
                                className="input-field min-h-[120px] bg-indigo-50/30 border-indigo-100 focus:border-indigo-300 focus:ring-indigo-100"
                                placeholder="- Task A 完了&#10;- Issue B 修正"
                            />
                        </div>
                    )}
                </div>

                <hr className="border-neutral-100" />

                {/* Plan Section */}
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <h3 className="text-lg font-bold text-neutral-800">Next Week Plans (차주 계획)</h3>
                        <span className="text-xs text-neutral-400">Planned activities for next week</span>
                    </div>
                    <textarea
                        name="plans"
                        value={formData.plans}
                        onChange={handleChange}
                        className="input-field min-h-[120px]"
                        placeholder="- Start Phase 2&#10;- Meeting with Client C"
                    />
                    {showJapanese && (
                        <div className="relative animate-in slide-in-from-top-2 duration-200">
                            <span className="absolute top-3 right-3 text-xs font-bold text-indigo-300">🇯🇵 Japanese</span>
                            <textarea
                                name="plansJa"
                                value={formData.plansJa}
                                onChange={handleChange}
                                className="input-field min-h-[120px] bg-indigo-50/30 border-indigo-100 focus:border-indigo-300 focus:ring-indigo-100"
                                placeholder="- Phase 2 開始&#10;- Client C ミーティング"
                            />
                        </div>
                    )}
                </div>

                <hr className="border-neutral-100" />

                {/* Issues Section */}
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <h3 className="text-lg font-bold text-neutral-800">Issues & Requests (이슈 및 건의사항)</h3>
                        <span className="text-xs text-neutral-400">Blockers or support needed</span>
                    </div>
                    <textarea
                        name="issues"
                        value={formData.issues}
                        onChange={handleChange}
                        className="input-field min-h-[80px]"
                        placeholder="No major issues."
                    />
                    {showJapanese && (
                        <div className="relative animate-in slide-in-from-top-2 duration-200">
                            <span className="absolute top-3 right-3 text-xs font-bold text-indigo-300">🇯🇵 Japanese</span>
                            <textarea
                                name="issuesJa"
                                value={formData.issuesJa}
                                onChange={handleChange}
                                className="input-field min-h-[80px] bg-indigo-50/30 border-indigo-100 focus:border-indigo-300 focus:ring-indigo-100"
                                placeholder="特になし"
                            />
                        </div>
                    )}
                </div>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-end gap-3 pt-4">
                <button className="px-6 py-2.5 bg-white border border-neutral-300 text-neutral-700 rounded-lg font-medium hover:bg-neutral-50 transition-colors flex items-center gap-2">
                    <Save className="w-4 h-4" />
                    Save Draft
                </button>
                <button
                    onClick={handleSubmit}
                    disabled={isSubmitting}
                    className="px-6 py-2.5 bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700 transition-colors shadow-lg shadow-primary-600/20 flex items-center gap-2"
                >
                    <Send className="w-4 h-4" />
                    {isSubmitting ? 'Submitting...' : 'Submit Report'}
                </button>
            </div>
        </div>
    );
}

export default WeeklyReportForm;
