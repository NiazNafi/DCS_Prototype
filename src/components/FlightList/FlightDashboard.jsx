import React from 'react';
import { RefreshCw } from 'lucide-react';
import StatusBadge from './StatusBadge';

const FlightDashboard = ({ flightData, activeTab, setActiveTab }) => {
  return (
    // 1. COMPACT CONTAINER: Reduced padding (px-4 pt-2)
    <div className="bg-white px-4 pt-2 pb-0 rounded-t-lg border-b border-gray-200">
      
      {/* HEADER ROW */}
      {/* 2. REMOVED GAP: Reduced bottom margin significantly (mb-2) */}
      <div className="flex flex-col lg:flex-row items-center justify-between gap-3 m-3">
        
        {/* LEFT: Title (Smaller font) */}
        <div className="shrink-0 flex items-center gap-3">
          <h2 className="text-md font-bold text-gray-800">Flight Dashboard</h2>
          {/* Optional: You could put the PCB number here to save even more space */}
        </div>

        {/* CENTER: Flight Info (Ultra Compact Pill) */}
        <div className="flex-1 w-full lg:w-auto flex justify-center">
          {/* 3. SLIM PILL: Reduced padding (py-1), text size (text-xs), and gap (gap-x-4) */}
          <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1 text-xs text-gray-600 bg-gray-50 px-3 py-1 rounded-md border border-gray-200 shadow-sm">
            <span className="whitespace-nowrap">
              Flight: <span className="font-bold text-gray-900">{flightData.flight}</span>
            </span>
            <span className="whitespace-nowrap">
              Date: <span className="font-bold text-gray-900">{flightData.date}</span>
            </span>
            <span className="whitespace-nowrap">
              ETD: <span className="font-bold text-gray-900">{flightData.etd || flightData.std}</span>
            </span>
            <span className="whitespace-nowrap">
              BTID: <span className="font-bold text-gray-900">{flightData.btd || '13:30'}</span>
            </span>
            <span className="whitespace-nowrap">
              Gate: <span className="font-bold text-gray-900">{flightData.gate}</span>
            </span>
          </div>
        </div>

        {/* RIGHT: Status & PCB (Side-by-side to save height) */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="bg-blue-50 text-blue-700 px-2 py-0.5 rounded text-sm font-bold border border-blue-100">
            {flightData.pcb || '153/0/0'}
          </div>
          <StatusBadge status={flightData.status} isDashboard={true} />
        </div>

      </div>

      {/* TABS (Slimmer) */}
      <div className="flex space-x-1 overflow-x-auto">
        {['Check-in', 'Boarding', 'Reports','Flight Summary'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            // 4. SLIM TABS: Reduced vertical padding (py-2) and font size (text-xs)
            className={`px-6 py-2 text-xs font-bold uppercase tracking-wide rounded-t-md transition-all whitespace-nowrap ${
              activeTab === tab
                ? 'bg-blue-50 text-blue-700 border-b-2 border-blue-600'
                : 'bg-transparent text-gray-500 hover:bg-gray-50 hover:text-gray-700'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>
    </div>
  );
};

export default FlightDashboard;