import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from 'sonner';
import RndDemoPage from './pages/RndDemoPage';

function App() {
    return (
        <BrowserRouter>
            <div className="min-h-screen bg-gray-50 text-gray-900">
                <h1 className="text-3xl font-bold underline p-10">
                    Admin Dashboard Setup
                </h1>
                <Routes>
                    <Route path="/" element={<RndDemoPage />} />
                    <Route path="/rnd-demo" element={<RndDemoPage />} />
                </Routes>
            </div>
            <Toaster position="top-right" />
        </BrowserRouter>
    )
}

export default App
