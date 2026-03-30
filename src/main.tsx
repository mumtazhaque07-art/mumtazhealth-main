import { createRoot } from "react-dom/client";
import { registerSW } from 'virtual:pwa-register';
import App from "./App.tsx";
import "./index.css";

// Register PWA Service Worker for offline support and auto-updates
const updateSW = registerSW({
  onNeedRefresh() {
    if (confirm('New application update available. Relod to update?')) {
      updateSW(true);
    }
  },
  onOfflineReady() {
    console.log('Mumtaz Health is ready to be used offline.');
  },
});

createRoot(document.getElementById("root")!).render(<App />);
