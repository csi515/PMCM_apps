import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import '@repo/ui/src/index.css' // Import shared UI styles if applicable, or local css
import './index.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
        <App />
    </React.StrictMode>,
)
