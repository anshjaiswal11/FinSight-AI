import {
  BrowserRouter as Router,
  Routes,
  Route,
} from 'react-router-dom';
import AIAnalysisText from './pages/AIAnalysisText';
import StockAnalysis from './pages/StockAnalysis';
import Home from './pages/Home';
import { Link, useLocation } from 'react-router-dom';
import { TrendingUp, BarChart3, DollarSign } from 'lucide-react';
import React, { useState } from 'react';

function Navbar() {
  const [open, setOpen] = useState(false);
  const location = useLocation();
  return (
    <>
      {/* Floating animated background for navbar */}
      <div className="fixed top-0 left-1/2 transform -translate-x-1/2 z-40 w-full max-w-2xl pointer-events-none">
        <div className="absolute left-1/2 -translate-x-1/2 top-0 w-80 h-32 bg-blue-400/20 rounded-full blur-2xl animate-pulse"></div>
        <div className="absolute left-1/2 -translate-x-1/2 top-8 w-60 h-16 bg-purple-400/20 rounded-full blur-2xl animate-pulse delay-1000"></div>
      </div>
      <nav
        className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 w-[95vw] max-w-2xl mx-auto flex items-center justify-between px-4 py-2 md:px-8 md:py-3 rounded-2xl shadow-lg bg-white/70 backdrop-blur-md border border-blue-100"
        style={{
          transition: 'box-shadow 0.3s',
        }}
      >
        <div className="flex items-center space-x-2">
          <div className="w-9 h-9 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
            <TrendingUp className="w-5 h-5 text-white" />
          </div>
          <span className="font-bold text-lg bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent select-none">FinSight-AI</span>
        </div>
        <button className="md:hidden ml-2" onClick={() => setOpen(!open)} aria-label="Toggle menu">
          <svg className="w-7 h-7 text-blue-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
        <div className={`flex-col md:flex-row md:flex items-center gap-6 md:gap-8 absolute md:static top-16 left-0 w-full md:w-auto bg-white/90 md:bg-transparent rounded-2xl md:rounded-none shadow-lg md:shadow-none border md:border-none border-blue-100 md:opacity-100 transition-all duration-300 ${open ? 'flex' : 'hidden md:flex'}`}>
          <Link to="/" className={`block px-6 py-3 md:p-0 font-medium text-base transition-colors duration-200 ${location.pathname === '/' ? 'text-blue-700' : 'text-slate-700 hover:text-blue-600'}`} onClick={() => setOpen(false)}>Home</Link>
          <Link to="/budget" className={`block px-6 py-3 md:p-0 font-medium text-base transition-colors duration-200 ${location.pathname === '/budget' ? 'text-blue-700' : 'text-slate-700 hover:text-blue-600'}`} onClick={() => setOpen(false)}>Budget Planner</Link>
          <Link to="/analysis" className={`block px-6 py-3 md:p-0 font-medium text-base transition-colors duration-200 ${location.pathname === '/analysis' ? 'text-blue-700' : 'text-slate-700 hover:text-blue-600'}`} onClick={() => setOpen(false)}>Stock Analysis</Link>
        </div>
      </nav>
      <style>{`
        @media (max-width: 768px) {
          nav {
            left: 50% !important;
            transform: translateX(-50%) !important;
          }
        }
      `}</style>
    </>
  );
}

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/budget" element={<AIAnalysisText />} />
        <Route path="/analysis" element={<StockAnalysis />} />
      </Routes>
    </Router>
  );
}

export default App;
