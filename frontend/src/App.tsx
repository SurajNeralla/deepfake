import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Navbar } from './components/Navbar';
import { Sidebar } from './components/Sidebar';
import { Footer } from './components/Footer';
import { ToastContainer } from './components/Toast';
import { useToast } from './hooks/useToast';

import { Dashboard } from './pages/Dashboard';
import { Analyze } from './pages/Analyze';
import { Results } from './pages/Results';
import { History } from './pages/History';
import { ReportView } from './pages/ReportView';
import { About } from './pages/About';
import { ForensicWorkspace } from './pages/ForensicWorkspace';
import { ModelCenter } from './pages/ModelCenter';

export const App: React.FC = () => {
  const { toasts, addToast, removeToast } = useToast();

  return (
    <Router>
      <div className="min-h-screen bg-[#05060B] text-[#e3e1e9] flex flex-col antialiased">
        <Navbar />
        <Sidebar />

        {/* Main Content Viewport offset for Navbar (top 16) and Sidebar (left 64 on desktop) */}
        <main className="flex-1 md:ml-64 pt-20 flex flex-col">
          <div className="flex-1">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/workspace" element={<ForensicWorkspace />} />
              <Route path="/models" element={<ModelCenter />} />
              <Route path="/analyze" element={<Analyze addToast={addToast} />} />
              <Route path="/results/:id" element={<Results addToast={addToast} />} />
              <Route path="/history" element={<History />} />
              <Route path="/reports/:id" element={<ReportView />} />
              <Route path="/about" element={<About />} />
            </Routes>
          </div>
          <Footer />
        </main>

        <ToastContainer toasts={toasts} onClose={removeToast} />
      </div>
    </Router>
  );
};

export default App;
