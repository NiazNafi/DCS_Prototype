import React, { useState } from 'react';
import { Plane, Plus, ChevronDown, X, Search } from 'lucide-react';
import FlightDashboard from '../components/FlightList/FlightDashboard';
import StatusBadge from '../components/FlightList/StatusBadge';
import CheckInView from '../components/CheckIn/CheckInView';
import BoardingView from '../components/Boarding/BoardingView';
import ReportsView from '../components/Reports/ReportsView';
import FlightSummaryView from '../components/FlightSummary/FlightSummary';

const DepartureFlightList = () => {
  const [tabs, setTabs] = useState([{ id: 'new-1', name: 'New Flight', color: 'blue', loaded: false }]);
  const [activeTabId, setActiveTabId] = useState('new-1');
  
  // Filters
  const [searchOrigin, setSearchOrigin] = useState(''); 
  const [filterDate, setFilterDate] = useState('2025-11-16'); 
  const [statusFilter, setStatusFilter] = useState('All'); 

  const [nextNewFlightNum, setNextNewFlightNum] = useState(1);
  const [dashboardTab, setDashboardTab] = useState('Check-in');

  // Define Color Schemes
  // Added 'accent' for the active tab top border
  const colorSchemes = [
    { name: 'blue', bg: 'bg-blue-100', text: 'text-blue-700', border: 'border-blue-200', accent: 'border-t-blue-600', icon: 'text-blue-600', button: 'bg-blue-600 hover:bg-blue-700' },
    { name: 'emerald', bg: 'bg-emerald-100', text: 'text-emerald-700', border: 'border-emerald-200', accent: 'border-t-emerald-600', icon: 'text-emerald-600', button: 'bg-emerald-600 hover:bg-emerald-700' },
    { name: 'orange', bg: 'bg-orange-100', text: 'text-orange-700', border: 'border-orange-200', accent: 'border-t-orange-600', icon: 'text-orange-600', button: 'bg-orange-600 hover:bg-orange-700' },
  ];

  const getScheme = (colorName) => colorSchemes.find(c => c.name === colorName) || colorSchemes[0];

  const flights = [
    { flight: 'BS101', route: 'CGP-DAC', date: '2025-11-16', std: '14:30', status: 'CKO', reg: 'G-XLEB', gate: 'A1', pcb: '250/10/30', timing: 'On Time' },
    { flight: 'BS103', route: 'DAC-CGP', date: '2025-11-16', std: '15:00', status: 'OPN', reg: 'N751AN', gate: 'B2', pcb: '200/8/0', timing: 'Delayed' },
    { flight: 'BS143', route: 'DAC-ZYL', date: '2025-11-16', std: '16:00', status: 'Closed', reg: 'N801DN', gate: 'C1', pcb: '180/43/22', timing: 'On Time' },
    { flight: 'BS202', route: 'JED-DAC', date: '2025-11-16', std: '18:00', status: 'CKC-BDO', reg: 'S2-AEF', gate: 'D4', pcb: '300/12/45', timing: 'Boarding' },
    { flight: 'BS303', route: 'DAC-LHR', date: '2025-11-17', std: '10:00', status: 'CKC-BDC', reg: 'G-XLEB', gate: 'A1', pcb: '150/8/20', timing: 'On Time' },
    { flight: 'BS404', route: 'DAC-CXB', date: '2025-11-17', std: '11:00', status: 'XLD', reg: 'S2-AHW', gate: 'D2', pcb: '0/0/0', timing: 'Delayed' },
  ];

  // Filtering Logic
  const filteredFlights = flights.filter(f => {
    const searchTerm = searchOrigin.toLowerCase();
    const matchesSearch = searchOrigin === '' || 
                          f.route.toLowerCase().includes(searchTerm) || 
                          f.flight.toLowerCase().includes(searchTerm);
    const matchesDate = filterDate === '' || f.date === filterDate;
    const matchesStatus = statusFilter === 'All' || f.status === statusFilter;
    return matchesSearch && matchesDate && matchesStatus;
  });

  const handleLoadFlight = (flight) => {
    const currentTab = tabs.find(t => t.id === activeTabId);
    
    if (currentTab && !currentTab.loaded) {
       const updatedTabs = tabs.map(t => {
           if (t.id === activeTabId) {
               return {
                   ...t,
                   id: flight.flight, 
                   name: flight.flight,
                   flightData: flight,
                   loaded: true
               };
           }
           return t;
       });
       setTabs(updatedTabs);
       setActiveTabId(flight.flight); 
    } else {
        const existingTab = tabs.find(t => t.id === flight.flight);
        if (existingTab) {
            setActiveTabId(flight.flight);
        } else {
            const colorIndex = tabs.length % colorSchemes.length;
            const newTab = {
                id: flight.flight,
                name: flight.flight,
                color: colorSchemes[colorIndex].name,
                loaded: true,
                flightData: flight,
            };
            setTabs([...tabs, newTab]);
            setActiveTabId(flight.flight);
        }
    }
  };

  const handleAddNewTab = () => {
    const newId = `new-${nextNewFlightNum + 1}`;
    const colorIndex = tabs.length % colorSchemes.length;
    setTabs([...tabs, { id: newId, name: 'New Flight', color: colorSchemes[colorIndex].name, loaded: false }]);
    setActiveTabId(newId);
    setNextNewFlightNum(nextNewFlightNum + 1);
  };

  const handleCloseTab = (id) => {
    if (tabs.length === 1) return;
    const newTabs = tabs.filter(t => t.id !== id);
    setTabs(newTabs);
    if (activeTabId === id) {
      setActiveTabId(newTabs[0].id);
    }
  };

  const activeTab = tabs.find(t => t.id === activeTabId);
  const activeScheme = getScheme(activeTab?.color);

  const getTimingPill = (timing) => {
      switch(timing) {
          case 'Delayed': return <span className="bg-red-100 text-red-700 text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider">Delayed</span>;
          case 'Boarding': return <span className="bg-orange-100 text-orange-700 text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider">Boarding</span>;
          default: return <span className="bg-emerald-100 text-emerald-700 text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider">On Time</span>;
      }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden min-h-[800px]">
        
        {/* Main App Header */}
        <div className="bg-white border-b border-gray-200 px-4 pt-4">
          
          
          <div className="flex items-end space-x-1">
            {tabs.map((tab) => {
              const isActive = tab.id === activeTabId;
              const tabScheme = getScheme(tab.color);
              
              return (
                <div key={tab.id} className="group flex items-center relative">
                  <button
                    onClick={() => setActiveTabId(tab.id)}
                    className={`px-4 py-2 text-sm font-medium rounded-t-lg transition-all ${
                      isActive
                        // ACTIVE STATE: White BG, Dark Text, Thick Top Border (Accent)
                        ? `bg-white text-gray-900 border-x border-t-4 border-b-0 ${tabScheme.accent} border-x-gray-200 z-10 shadow-sm`
                        
                        // INACTIVE STATE: Uses the Scheme Color (Light BG + Color Text)
                        : `${tabScheme.bg} ${tabScheme.text} border border-transparent hover:opacity-80`
                    }`}
                  >
                    {tab.name}
                  </button>
                  
                  {tabs.length > 1 && (
                    <button
                      onClick={(e) => { e.stopPropagation(); handleCloseTab(tab.id); }}
                      className={`absolute right-1 top-2 p-0.5 rounded-full hover:bg-red-100 hover:text-red-500 transition-colors ${
                          isActive 
                            ? 'text-gray-400' 
                            : 'text-gray-500 opacity-0 group-hover:opacity-100'
                      }`}
                    >
                      <X size={12} />
                    </button>
                  )}
                </div>
              );
            })}
            <button
              onClick={handleAddNewTab}
              className="p-2 mb-1 text-gray-500 hover:bg-gray-100 rounded bg-gray-50 border border-gray-200"
            >
              <Plus size={16} />
            </button>
          </div>
        </div>
        {!activeTab?.loaded && (
  <div className="flex items-center space-x-3 m-3 pl-2">
    <Plane className={`w-6 h-6 ${activeScheme.icon}`} />
    <h1 className="text-xl font-bold text-gray-800">Departure Flight List</h1>
  </div>
)}

        {/* Content Area */}
        <div className="bg-white -mt-2">
          {activeTab.loaded && activeTab.flightData ? (
            <div className="animate-in fade-in duration-300">
               <FlightDashboard 
                  flightData={activeTab.flightData} 
                  activeTab={dashboardTab} 
                  setActiveTab={setDashboardTab} 
               />
               
               {dashboardTab === 'Check-in' && <CheckInView />}
               {dashboardTab === 'Boarding' && <BoardingView />}
               {dashboardTab === 'Reports' && <ReportsView />}
               {dashboardTab === 'Flight Summary' && <FlightSummaryView />}
            </div>
          ) : (
            <div className="p-6">
              {/* Search Box - Border color adapts to active tab scheme */}
              <div className={`bg-white rounded-lg p-6 border shadow-sm mb-6 ${activeScheme.border}`}>
                 <div className="flex flex-wrap items-end gap-4">
                    
                    <div className="space-y-1">
                        <label className="text-xs font-semibold text-gray-500 uppercase flex items-center gap-1">
                             Flight / Route
                        </label>
                        <div className="relative">
                            <input
                                type="text"
                                value={searchOrigin}
                                onChange={(e) => setSearchOrigin(e.target.value)}
                                className={`w-48 px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-opacity-50 pl-9 focus:${activeScheme.border.replace('border-', 'ring-')}`}
                                placeholder="e.g. BS101 or DAC"
                            />
                            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-2.5 pointer-events-none" />
                        </div>
                    </div>
                    
                    <div className="space-y-1">
                        <label className="text-xs font-semibold text-gray-500 uppercase flex items-center gap-1">
                            Date
                        </label>
                        <div className="relative">
                            <input
                                type="date"
                                value={filterDate}
                                onChange={(e) => setFilterDate(e.target.value)}
                                className={`w-48 px-4 py-2 border border-gray-300 bg-white rounded text-gray-600 focus:outline-none focus:ring-2 focus:ring-opacity-50 focus:${activeScheme.border.replace('border-', 'ring-')}`}
                            />
                        </div>
                    </div>

                    <div className="space-y-1">
                        <label className="text-xs font-semibold text-gray-500 uppercase flex items-center gap-1">
                            Operational Status
                        </label>
                        <div className="relative">
                            <select
                                value={statusFilter}
                                onChange={(e) => setStatusFilter(e.target.value)}
                                className={`w-48 px-4 py-2 border border-gray-300 rounded appearance-none bg-white focus:outline-none focus:ring-2 focus:ring-opacity-50 focus:${activeScheme.border.replace('border-', 'ring-')}`}
                            >
                                <option value="All">All Status</option>
                                <option value="OPN">Open (OPN)</option>
                                <option value="CKO">Check-in Open (CKO)</option>
                                <option value="CKC-BDO">CKC-BDO</option>
                                <option value="CKC-BDC">CKC-BDC</option>
                                <option value="Closed">Flight Closed</option>
                                <option value="XLD">Cancelled (XLD)</option>
                            </select>
                            <ChevronDown className="w-4 h-4 text-gray-400 absolute right-3 top-3 pointer-events-none" />
                        </div>
                    </div>
                 </div>
              </div>

              {/* Table */}
              <div className="border border-gray-200 rounded-lg overflow-hidden shadow-sm">
                <table className="w-full text-left">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      {['Flight', 'Route', 'Date', 'STD', 'Status', 'Reg', 'Gate', 'P/C/B', 'Action'].map(h => (
                        <th key={h} className="py-3 px-4 text-xs font-bold text-gray-500 uppercase tracking-wider">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {filteredFlights.length > 0 ? filteredFlights.map((flight, index) => (
                      <tr key={index} className={`hover:bg-gray-50 transition-colors group`}>
                        <td className="py-4 px-4 font-bold text-gray-900">{flight.flight}</td>
                        <td className="py-4 px-4 text-gray-600 font-medium">{flight.route}</td>
                        <td className="py-4 px-4 text-gray-600">{flight.date}</td>
                        <td className="py-4 px-4 text-gray-600 font-mono">{flight.std}</td>
                        
                        <td className="py-4 px-4">
                             <StatusBadge status={flight.status} />
                        </td>
                        
                        <td className="py-4 px-4 text-gray-600 font-mono text-xs">{flight.reg}</td>
                        <td className="py-4 px-4 text-gray-900 font-bold">{flight.gate}</td>
                        <td className="py-4 px-4 text-gray-600 font-mono text-xs">{flight.pcb}</td>
                        
                        <td className="py-4 px-4">
                          <div className="flex items-center space-x-3">
                            <button
                                onClick={() => handleLoadFlight(flight)}
                                className={`px-4 py-1.5 ${activeScheme.button} text-white text-xs font-bold rounded shadow-sm hover:shadow transition-all transform active:scale-95`}
                            >
                                Load Flight
                            </button>
                            {getTimingPill(flight.timing)}
                          </div>
                        </td>
                      </tr>
                    )) : (
                        <tr>
                            <td colSpan="9" className="py-8 text-center text-gray-500">
                                No flights found matching your criteria.
                            </td>
                        </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DepartureFlightList;