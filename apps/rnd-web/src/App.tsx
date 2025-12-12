import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider } from '@repo/ui';
import Layout from './layouts/Layout';
import Dashboard from './pages/Dashboard';
import ProjectList from './pages/ProjectList';
import EquipmentList from './pages/EquipmentList';
import InventoryList from './pages/InventoryList';
import NotFound from './pages/NotFound';

function App() {
    return (
        <AppProvider>
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<Layout />}>
                        <Route index element={<Navigate to="/dashboard" replace />} />
                        <Route path="dashboard" element={<Dashboard />} />
                        <Route path="projects" element={<ProjectList />} />
                        <Route path="equipment" element={<EquipmentList />} />
                        <Route path="inventory" element={<InventoryList />} />
                        {/* Add more routes here */}
                    </Route>
                    <Route path="*" element={<NotFound />} />
                </Routes>
            </BrowserRouter>
        </AppProvider>
    );
}

export default App;
