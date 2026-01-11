import { createRoot } from "react-dom/client";
import App from './App.tsx'
import './index.css'
import { BrowserRouter } from 'react-router-dom'
import { Toaster } from './components/ui/toaster.tsx'
import { registerServiceWorker } from './utils/registerServiceWorker'

// Register service worker for PWA
registerServiceWorker();

createRoot(document.getElementById("root")!).render(<App />);
