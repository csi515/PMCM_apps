import React, { Suspense } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClientProvider } from '@tanstack/react-query';
import { AppProvider } from '@repo/ui'; // Import context provider
import { queryClient } from './lib/query-client';
import RootLayout from './layouts/RootLayout';
import './i18n';

// Lazy load pages (Placeholders for now)
import VocList from './pages/voc/VocList';
import VocForm from './pages/voc/VocForm';
import FmeaList from './pages/fmea/FmeaList';
import FmeaEditor from './pages/fmea/FmeaEditor';
import StandardLibraryList from './pages/data/StandardLibraryList';
import PpapList from './pages/ppap/PpapList';
import PpapWizard from './pages/ppap/PpapWizard';
import QualityIssueList from './pages/quality/QualityIssueList';
import QualityIssueWizard from './pages/quality/QualityIssueWizard';
import SpcDashboard from './pages/spc/SpcDashboard';

const Dashboard = () => <div className="p-4"><h1>Dashboard (Coming Soon)</h1></div>;

function App() {
    return (
        <QueryClientProvider client={queryClient}>
            <AppProvider>
                <BrowserRouter>
                    <Suspense fallback={<div>Loading...</div>}>
                        <Routes>
                            <Route path="/" element={<RootLayout />}>
                                <Route index element={<Navigate to="/voc" replace />} />
                                <Route path="voc" element={<VocList />} />
                                <Route path="voc/new" element={<VocForm />} />
                                <Route path="fmea" element={<FmeaList />} />
                                <Route path="fmea/new" element={<FmeaEditor />} />
                                <Route path="fmea/:id" element={<FmeaEditor />} />
                                <Route path="standard-library" element={<StandardLibraryList />} />
                                <Route path="ppap" element={<PpapList />} />
                                <Route path="ppap/new" element={<PpapWizard />} />
                                <Route path="ppap/:id" element={<PpapWizard />} />
                                <Route path="issues" element={<QualityIssueList />} />
                                <Route path="issues/new" element={<QualityIssueWizard />} />
                                <Route path="issues/:id" element={<QualityIssueWizard />} />
                                <Route path="spc" element={<SpcDashboard />} />
                                <Route path="*" element={<div>404 Not Found</div>} />
                            </Route>
                        </Routes>
                    </Suspense>
                </BrowserRouter>
            </AppProvider>
        </QueryClientProvider>
    );
}

export default App;
