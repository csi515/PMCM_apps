import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from 'sonner';

function App() {
    return (
        <BrowserRouter>
            <div className="min-h-screen bg-gray-50 text-gray-900">
                <h1 className="text-3xl font-bold underline p-10">
                    Admin Dashboard Setup
                </h1>
                <Routes>
                    {/* Define admin routes here */}
                </Routes>
            </div>
            <Toaster position="top-right" />
        </BrowserRouter>
    )
}

export default App
