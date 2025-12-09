


import React, { useState } from 'react';
import { User, Baby, Ban, Accessibility, ChevronDown, X, Armchair, Luggage, MoreVertical } from 'lucide-react';

// --- HELPER: SEAT INCREMENT LOGIC ---
const incrementSeat = (startSeat, index) => {
  if (!startSeat) return '';
  const match = startSeat.match(/(\d+)([A-Z])/);
  if (!match) return startSeat;
  const row = match[1];
  const charCode = match[2].charCodeAt(0);
  return `${row}${String.fromCharCode(charCode + index)}`;
};

// --- COMPONENT: VERTICAL SEAT MAP (SIDEBAR) ---
const SeatMap = () => {
  // Helper to render a single seat
  const renderSeat = (seatNum, status = 'available', type = 'economy') => {
    let bgColor = 'bg-white border border-gray-300 text-gray-600';
    if (status === 'occupied') bgColor = 'bg-blue-100 border-blue-200 text-blue-400 cursor-not-allowed';
    if (status === 'blocked') bgColor = 'bg-gray-100 border-gray-200 text-gray-300';
    if (status === 'checked-in') bgColor = 'bg-green-100 border-green-200 text-green-600';

    // Different widths for different classes
    const sizeClass = type === 'business' ? 'w-10 h-10' : 'w-8 h-8';

    return (
      <div className={`relative flex items-center justify-center ${sizeClass} rounded-md ${bgColor} text-[10px] font-bold cursor-pointer hover:shadow-md transition-all`}>
         {seatNum}
      </div>
    );
  };

  // Helper to render a Row number
  const renderRowLabel = (num) => (
      <div className="w-6 flex items-center justify-center text-[10px] text-gray-300 font-mono">
          {num}
      </div>
  );

  return (
    <div className="w-[380px] bg-white border-l border-gray-200 flex flex-col h-screen shrink-0 z-40 shadow-xl">
      
      {/* 1. HEADER & CONTROLS */}
      <div className="p-5 border-b border-gray-100 bg-white z-10">
          <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold text-gray-800 text-sm flex items-center gap-2">
                  <Armchair size={16} className="text-blue-600"/>
                  Seat Map
              </h3>
              <div className="flex gap-2 text-[10px]">
                  <div className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-blue-100"></div> Occ</div>
                  <div className="flex items-center gap-1"><div className="w-2 h-2 rounded-full border border-gray-300"></div> Avail</div>
              </div>
          </div>
          
          <div className="relative">
            <input 
                type="text" 
                placeholder="Find seat..." 
                className="w-full bg-gray-50 border border-gray-200 rounded px-3 py-2 text-xs outline-none focus:ring-2 focus:ring-blue-500 transition-all"
            />
             <div className="absolute right-2 top-2 text-gray-400">
                <ChevronDown size={14} />
             </div>
          </div>
      </div>

      {/* 2. SCROLLABLE PLANE BODY */}
      <div className="flex-1 overflow-y-auto bg-gray-50/50 p-4 scrollbar-thin">
          <div className="flex flex-col items-center gap-6 pb-20">
              
              {/* --- FIRST CLASS (1 Row) --- */}
              <div className="w-full">
                  <div className="text-center text-[9px] text-gray-400 uppercase tracking-widest mb-2 font-bold">First Class</div>
                  <div className="bg-white p-3 rounded-xl border border-gray-200 shadow-sm flex justify-center gap-4">
                      {renderSeat('1A', 'occupied', 'first')}
                      {renderRowLabel(1)}
                      {renderSeat('1C', 'available', 'first')}
                  </div>
              </div>

              {/* --- BUSINESS CLASS (1 Row) --- */}
              <div className="w-full">
                  <div className="text-center text-[9px] text-gray-400 uppercase tracking-widest mb-2 font-bold">Business</div>
                  <div className="bg-white p-3 rounded-xl border border-blue-100 shadow-sm flex justify-center gap-2 relative overflow-hidden">
                      <div className="absolute top-0 left-0 w-1 h-full bg-blue-500"></div>
                      <div className="flex gap-2">
                          {renderSeat('2A', 'available', 'business')}
                          {renderSeat('2C', 'occupied', 'business')}
                      </div>
                      {renderRowLabel(2)}
                      <div className="flex gap-2">
                          {renderSeat('2D', 'available', 'business')}
                          {renderSeat('2F', 'available', 'business')}
                      </div>
                  </div>
              </div>

              {/* --- ECONOMY CLASS (Rows 3-12) --- */}
              <div className="w-full">
                  <div className="text-center text-[9px] text-gray-400 uppercase tracking-widest mb-2 font-bold">Economy</div>
                  <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex flex-col gap-3">
                      
                      {/* Loop to generate rows 3 to 12 */}
                      {Array.from({length: 10}).map((_, i) => {
                          const rowNum = 3 + i;
                          // Fake status logic for demo
                          const sA = (rowNum === 5 || rowNum === 8) ? 'occupied' : 'available';
                          const sB = (rowNum === 3) ? 'blocked' : 'available';
                          const sC = (rowNum === 6) ? 'checked-in' : 'available';
                          
                          return (
                              <div key={rowNum} className="flex justify-center items-center gap-3">
                                  <div className="flex gap-1">
                                      {renderSeat(`${rowNum}A`, sA)}
                                      {renderSeat(`${rowNum}B`, sB)}
                                  </div>
                                  
                                  {renderRowLabel(rowNum)}
                                  
                                  <div className="flex gap-1">
                                      {renderSeat(`${rowNum}C`, sC)}
                                      {renderSeat(`${rowNum}D`, 'available')}
                                  </div>
                              </div>
                          );
                      })}

                      {/* Wings/Exit Decoration (Optional) */}
                      <div className="absolute -left-2 top-1/2 -translate-y-1/2 w-4 h-24 bg-gray-200 rounded-r-full opacity-20 pointer-events-none"></div>
                      <div className="absolute -right-2 top-1/2 -translate-y-1/2 w-4 h-24 bg-gray-200 rounded-l-full opacity-20 pointer-events-none"></div>
                  </div>
              </div>
          </div>
      </div>

      {/* 3. FOOTER LEGEND */}
      <div className="p-4 bg-gray-50 border-t border-gray-200 text-[10px] text-center text-gray-400">
         <div className="grid grid-cols-3 gap-2">
             <div className="flex flex-col items-center gap-1">
                 <User size={14} className="text-purple-500" />
                 <span>UM</span>
             </div>
             <div className="flex flex-col items-center gap-1">
                 <Accessibility size={14} className="text-blue-500" />
                 <span>WCHR</span>
             </div>
             <div className="flex flex-col items-center gap-1">
                 <Baby size={14} className="text-orange-500" />
                 <span>Infant</span>
             </div>
         </div>
      </div>

    </div>
  );
};

// --- COMPONENT: PASSENGER LIST ---
const PassengerList = () => {

  
  // --- DATA ---
  const initialPassengers = [
    { id: 1, name: 'Rahman/Ashiqur/Mr', seat: '12A', seq: '001', doc: 'A0192837', type: 'M', pnr: 'RAH123', bag: '1', weight: '23', status: 'CK1', ticket: '9988776610/1', cabin: 'Y', io: 'I' },
    { id: 2, name: 'Rahman/Fariha/Mrs', seat: '12B', seq: '002', doc: 'A0192838', type: 'F', pnr: 'RAH123', bag: '1', weight: '20', status: 'CK1', ticket: '9988776611/1', cabin: 'Y', io: 'I' },
    { id: 3, name: 'Rahman/Zayan/Mstr', seat: '', seq: '003', doc: 'A0192839', type: 'I', pnr: 'RAH123', bag: '0', weight: '0', status: 'CK1', ticket: '9988776612/1', cabin: 'Y', io: 'I' },
    { id: 4, name: 'Chowdhury/Kamal/Mr', seat: '', seq: '', doc: 'B0987654', type: 'M', pnr: 'BIZ555', bag: '', weight: '', status: 'HK1', ticket: '8877665520/2', cabin: 'J', io: 'O' },
    { id: 5, name: 'Hossain/Jamal/Mr', seat: '', seq: '', doc: 'B0987655', type: 'M', pnr: 'BIZ555', bag: '', weight: '', status: 'HK1', ticket: '8877665521/2', cabin: 'J', io: 'O' },
    { id: 6, name: 'Das/Sajib/Mr', seat: '15A', seq: '004', doc: 'C5678901', type: 'M', pnr: 'DAS999', bag: '1', weight: '15', status: 'BD1', ticket: '7766554430/2', cabin: 'Y', io: 'O' },
    { id: 7, name: 'Das/Priya/Mrs', seat: '15B', seq: '005', doc: 'C5678902', type: 'F', pnr: 'DAS999', bag: '1', weight: '18', status: 'BD1', ticket: '7766554431/2', cabin: 'Y', io: 'O' },
    { id: 8, name: 'Das/Oishhee/Miss', seat: '15C', seq: '006', doc: 'C5678903', type: 'C', pnr: 'DAS999', bag: '1', weight: '10', status: 'BD1', ticket: '7766554432/2', cabin: 'Y', io: 'O' },
    { id: 9, name: 'Islam/Sharmin/Ms', seat: '20D', seq: '007', doc: 'D1122334', type: 'F', pnr: 'SOLO01', bag: '1', weight: '23', status: 'CK1', ticket: '6655443340/1', cabin: 'Y', io: 'I' },
    { id: 10, name: 'Khan/Azhar/Mr', seat: '', seq: '', doc: 'E9988776', type: 'M', pnr: 'SOLO02', bag: '', weight: '', status: 'HK1', ticket: '5544332250/2', cabin: 'Y', io: 'O' },
  ];

  // --- STATE ---
  const [passengers] = useState(initialPassengers);
  const [displayedList, setDisplayedList] = useState(initialPassengers); 
  const [selectedIds, setSelectedIds] = useState(new Set()); 
  const [searchQuery, setSearchQuery] = useState('');
  
  // Tag State
  const [pnrFilter, setPnrFilter] = useState(null); 

  // Panel State
  const [inputs, setInputs] = useState({}); 
  const [splitMode, setSplitMode] = useState({}); 

  // --- LOGIC: Handle Search ---
  const handleSearch = () => {
    const query = searchQuery.trim();
    if (!query) return;

    if (query.toUpperCase().startsWith('P/')) {
      // PNR Command Search
      const pnr = query.substring(2).toUpperCase();
      const matches = passengers.filter(p => p.pnr.toUpperCase().includes(pnr));
      setDisplayedList(matches);
      
      const newSet = new Set();
      matches.forEach(p => newSet.add(p.id));
      setSelectedIds(newSet);
      setPnrFilter(pnr);
    } else {
      // Standard Name/Ticket Search
      const lower = query.toLowerCase();
      const matches = passengers.filter(p => 
        p.name.toLowerCase().includes(lower) || 
        p.ticket.includes(query) || 
        p.pnr.toLowerCase().includes(lower)
      );
      setDisplayedList(matches);
      
      const newSet = new Set(selectedIds); 
      matches.forEach(p => newSet.add(p.id));
      setSelectedIds(newSet);
    }
    setSearchQuery('');
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') handleSearch();
  };

  // --- LOGIC: Toggle Selection ---
  const toggleSelection = (id) => {
    const newSet = new Set(selectedIds);
    if (newSet.has(id)) {
      newSet.delete(id);
    } else {
      newSet.add(id);
    }
    setSelectedIds(newSet);
  };

  // --- LOGIC: Clear Filters ---
  const clearFilters = () => {
    setDisplayedList(passengers); 
    setSelectedIds(new Set()); 
    setPnrFilter(null);
    setSplitMode({});
    setInputs({});
  };

  // --- LOGIC: Panel Helpers ---
  const handleInputChange = (id, field, value) => {
    setInputs(prev => ({
      ...prev,
      [id]: { ...prev[id], [field]: value }
    }));
  };

  const autoAssignSeats = (pnr) => {
    const pnrGroup = passengers.filter(p => p.pnr === pnr && selectedIds.has(p.id));
    if (pnrGroup.length === 0) return;

    const firstPaxId = pnrGroup[0].id;
    const startSeat = inputs[firstPaxId]?.seat || pnrGroup[0].seat || '';

    if (!startSeat) return;

    const newInputs = { ...inputs };
    pnrGroup.forEach((p, index) => {
      const seatVal = index === 0 ? startSeat : incrementSeat(startSeat, index);
      newInputs[p.id] = { ...newInputs[p.id], seat: seatVal };
    });
    setInputs(newInputs);
  };

  const toggleSplit = (pnr) => {
    setSplitMode(prev => ({ ...prev, [pnr]: !prev[pnr] })); 
  };

  const getSelectedGroups = () => {
    const selected = passengers.filter(p => selectedIds.has(p.id));
    const groups = {};
    selected.forEach(p => {
      if (!groups[p.pnr]) groups[p.pnr] = [];
      groups[p.pnr].push(p);
    });
    return groups;
  };

  const selectedGroups = getSelectedGroups();
  const hasSelection = selectedIds.size > 0;

  return (
    // 'min-h-full' allows it to stretch in the flex container
    <div className={`bg-white p-6 relative min-h-full flex flex-col font-sans text-sm ${hasSelection ? 'pb-96' : 'pb-20'}`}>
      
      {/* --- ACTIVE FILTERS & TAGS --- */}
      <div id="active-search-filters" className="flex flex-wrap gap-2 mb-2 min-h-[30px] items-center">
        
        {/* 1. PNR Tag (Blue) */}
        {pnrFilter && (
          <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-200 text-xs font-bold animate-in fade-in shadow-sm">
            <span>PNR: {pnrFilter}</span>
            <button onClick={clearFilters} className="hover:bg-blue-100 rounded-full p-0.5 transition-colors">
              <X size={12} strokeWidth={3} />
            </button>
          </div>
        )}
        
        {/* 2. Name Tags (Full Name Displayed) */}
        {passengers.map(p => {
            if (selectedIds.has(p.id)) {
                return (
                    <div key={p.id} className="flex items-center gap-2 px-3 py-1 rounded-full bg-purple-50 text-purple-700 border border-purple-200 text-xs font-medium animate-in fade-in shadow-sm">
                        {/* Display FULL NAME here */}
                        <span>{p.name}</span>
                        <button 
                          onClick={() => toggleSelection(p.id)} 
                          className="hover:bg-purple-100 rounded-full p-0.5 transition-colors"
                        >
                           <X size={12} strokeWidth={3} />
                        </button>
                    </div>
                );
            }
            return null;
        })}

        {/* Clear All Button */}
        {(pnrFilter || selectedIds.size > 0) && (
             <button onClick={clearFilters} className="text-xs text-gray-400 hover:text-gray-600 underline ml-2">Clear All</button>
        )}
      </div>

      {/* --- SEARCH BAR --- */}
      <div className="flex gap-2 mb-6">
        <input
          id="pax-search-input"
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type P/PNR for command select, or search Name..."
          className="flex-1 border border-gray-300 rounded px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none font-mono"
        />
        <button 
          id="pax-search-btn"
          onClick={handleSearch}
          className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 font-medium transition-colors"
        >
          Search
        </button>
      </div>

      {/* --- LIST FILTERS --- */}
      <div className="flex justify-between items-end mb-4">
        <h3 className="text-lg font-bold text-gray-800">Passenger List</h3>
        <div className="flex gap-2">
            {['Checked by me', 'Passenger Type', 'SSR'].map(f => (
                <button key={f} className="bg-gray-50 text-gray-600 border border-gray-200 px-3 py-1 rounded text-xs hover:bg-gray-100">
                    {f}
                </button>
            ))}
        </div>
      </div>

      {/* --- TABLE --- */}
      <div className="border border-gray-200 rounded-lg overflow-x-auto">
        {/* --- TABLE --- */}
<div className="border border-gray-200 rounded-lg overflow-x-auto">
  <table id="passenger-table" className="w-full text-left border-collapse text-sm">
    <thead className="bg-gray-100 text-gray-600 font-semibold uppercase text-xs">
      <tr>
        {/* Compact padding: py-2 instead of p-3 */}
        <th className="px-3 py-2 w-8 border-b text-center">
          <input type="checkbox" className="rounded align-middle" />
        </th>
        {['Name', 'Seq', 'Seat', 'ID', 'Type', 'PNR', 'Bag', 'Status', 'Cabin', 'Tkt', 'I/O', 'Actions'].map(h => (
          <th key={h} className="px-3 py-2 border-b whitespace-nowrap text-xs">{h}</th>
        ))}
      </tr>
    </thead>
    <tbody className="divide-y divide-gray-100">
      {displayedList.length === 0 ? (
        <tr><td colSpan="13" className="py-6 text-center text-gray-400">No passengers found</td></tr>
      ) : (
        displayedList.map((p) => {
          const isSel = selectedIds.has(p.id);
          return (
            <tr key={p.id} className={`hover:bg-gray-50 transition-colors ${isSel ? 'bg-blue-50/50' : ''}`}>
              
              {/* Checkbox Column */}
              <td className="px-3 py-1.5 text-center">
                <input 
                  type="checkbox" 
                  checked={isSel} 
                  onChange={() => toggleSelection(p.id)}
                  className="rounded accent-blue-600 w-3.5 h-3.5 align-middle" 
                />
              </td>

              {/* Name - slightly bolder, standard size */}
              <td className="px-3 py-1.5 font-medium text-gray-900 whitespace-nowrap text-xs">{p.name}</td>
              
              {/* Seq - dim color */}
              <td className="px-3 py-1.5 text-gray-500 text-xs">{p.seq || '-'}</td>
              
              {/* Seat - Bold */}
              <td className="px-3 py-1.5 font-bold text-gray-800 text-xs">{inputs[p.id]?.seat || p.seat || '-'}</td>
              
              {/* ID / Doc - Smaller text for ID */}
              <td className="px-3 py-1.5 text-xs text-gray-600">{p.doc}</td>
              
              {/* Type */}
              <td className="px-3 py-1.5 text-xs">{p.type}</td>
              
              {/* PNR - Monospace */}
              <td className="px-3 py-1.5 font-mono text-blue-600 text-xs font-medium">{p.pnr}</td>
              
              {/* Baggage */}
              <td className="px-3 py-1.5 text-xs whitespace-nowrap">{p.bag ? `${p.bag}/${p.weight}kg` : '-'}</td>
              
              {/* Status - Color coded */}
              <td 
                className="px-3 py-1.5 text-xs font-semibold whitespace-nowrap" 
                style={{ color: p.status === 'Checked-in' ? '#16a34a' : '#0369a1' }}
              >
                {p.status}
              </td>
              
              {/* Cabin */}
              <td className="px-3 py-1.5 text-xs">{p.cabin}</td>
              
              {/* Ticket Number - minimal text */}
              <td className="px-3 py-1.5 text-xs text-gray-500">{p.ticket}</td>
              
              {/* I/O Status Badge */}
              <td className="px-3 py-1.5">
                <span className={`px-1.5 py-0.5 rounded-[3px] text-[9px] uppercase font-bold tracking-wide border ${p.io === 'I' ? 'bg-blue-50 text-blue-700 border-blue-100' : 'bg-orange-50 text-orange-700 border-orange-100'}`}>
                  {p.io === 'I' ? 'IN' : 'OUT'}
                </span>
              </td>
              
              {/* Actions - smaller select box */}
              <td className="px-3 py-1.5 text-right">
                <select className="bg-white border border-gray-200 text-gray-600 rounded px-1.5 py-0.5 text-[11px] outline-none focus:border-blue-500 hover:border-gray-300">
                  <option>Options</option>
                </select>
              </td>
            </tr>
          );
        })
      )}
    </tbody>
  </table>
</div>
      </div>

      {/* --- CHECK-IN DOCK --- */}
      {hasSelection && (
        <div 
            id="checkin-dock" 
            // NOTE: right-[380px] ensures it stops exactly where the sidebar begins
            className="fixed bottom-0 left-64 right-[440px] bg-white border-t-4 border-blue-600 shadow-[0_-10px_40px_-10px_rgba(0,0,0,0.15)] z-50 animate-in slide-in-from-bottom duration-300"
        >
          <div className="max-w-full px-8 py-4">
             
             {/* Header Area */}
             <div className="flex justify-between items-center mb-4">
                 <div className="flex items-center gap-3">
                    <div className="bg-blue-100 p-2 rounded-full text-blue-700">
                        <Luggage size={20} />
                    </div>
                    <div>
                        <h3 className="font-bold text-gray-800 text-sm">Processing {selectedIds.size} Passenger{selectedIds.size > 1 ? 's' : ''}</h3>
                        <p className="text-xs text-gray-500">Assign seats and baggage for the selected group.</p>
                    </div>
                 </div>
                 
                 <div className="flex gap-2">
                     <button onClick={clearFilters} className="text-xs text-gray-500 hover:text-red-500 font-medium px-3 py-2">
                        Cancel
                     </button>
                     <button className="bg-blue-600 text-white px-6 py-2 rounded shadow-lg hover:bg-blue-700 font-bold text-sm transition-transform active:scale-95 flex items-center gap-2">
                        Finalize Check-in
                     </button>
                 </div>
             </div>

             {/* The "Mini-Table" Grid for perfect alignment */}
             <div className="flex flex-col gap-4 max-h-[250px] overflow-y-auto pr-2">
                {Object.entries(selectedGroups).map(([pnr, groupPax]) => (
                    <div key={pnr} className="bg-gray-50 border border-gray-200 rounded-lg p-3">
                        {/* Group Header */}
                        <div className="flex justify-between items-center mb-2 pb-2 border-b border-gray-200">
                            <span className="text-xs font-bold text-gray-400 font-mono tracking-wider">PNR: {pnr}</span>
                            {groupPax.length > 1 && (
                                <button 
                                    onClick={() => toggleSplit(pnr)}
                                    className="text-[10px] text-blue-600 font-bold uppercase hover:bg-blue-100 px-2 py-1 rounded transition-colors"
                                >
                                    {splitMode[pnr] ? 'Group Together' : 'Split Baggage'}
                                </button>
                            )}
                        </div>

                        {/* Passenger Rows */}
                        <div className="grid gap-2">
                            {groupPax.map((p, idx) => {
                                const isFirst = idx === 0;
                                const isSplit = splitMode[pnr];
                                const showBagInputs = isFirst || isSplit; 

                                return (
                                    <div key={p.id} className="grid grid-cols-12 gap-4 items-center">
                                        
                                        {/* 1. Name Column */}
                                        <div className="col-span-4 flex items-center gap-2">
                                            <div className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center text-[10px] font-bold text-gray-600">
                                                {p.seat ? p.seat : '?'}
                                            </div>
                                            <span className="text-sm font-medium text-gray-700 truncate" title={p.name}>
                                                {p.name}
                                            </span>
                                        </div>

                                        {/* 2. Seat Input */}
                                        <div className="col-span-2 flex items-center gap-1">
                                            <input 
                                                type="text" 
                                                value={inputs[p.id]?.seat || ''}
                                                onChange={(e) => handleInputChange(p.id, 'seat', e.target.value)}
                                                placeholder="SEAT"
                                                className="w-full border border-gray-300 rounded px-2 py-1.5 text-center font-bold text-gray-800 text-sm focus:ring-2 focus:ring-blue-500 outline-none uppercase"
                                            />
                                            {isFirst && (
                                                <button onClick={() => autoAssignSeats(pnr)} title="Auto-assign sequential seats" className="text-gray-400 hover:text-blue-600">
                                                    <MoreVertical size={14} />
                                                </button>
                                            )}
                                        </div>

                                        {/* 3. Baggage Inputs */}
                                        <div className="col-span-4 flex items-center gap-2">
                                            {showBagInputs ? (
                                                <>
                                                    <div className="flex-1 relative">
                                                        <span className="absolute left-2 top-1.5 text-[10px] text-gray-400 font-bold">PCS</span>
                                                        <input type="number" className="w-full border border-gray-300 rounded pl-8 pr-2 py-1.5 text-sm font-medium outline-none focus:border-blue-500" placeholder="0" />
                                                    </div>
                                                    <div className="flex-1 relative">
                                                        <span className="absolute left-2 top-1.5 text-[10px] text-gray-400 font-bold">WT</span>
                                                        <input type="text" className="w-full border border-gray-300 rounded pl-8 pr-2 py-1.5 text-sm font-medium outline-none focus:border-blue-500" placeholder="0" />
                                                    </div>
                                                </>
                                            ) : (
                                                <div className="w-full text-center text-xs text-gray-400 italic bg-gray-100 rounded py-1">
                                                    Pooled with {groupPax[0].name.split('/')[1]}
                                                </div>
                                            )}
                                        </div>

                                        {/* 4. Extra Actions */}
                                        <div className="col-span-2 text-right">
                                             <button className="text-xs text-blue-600 font-medium hover:underline">
                                                Special Handle
                                             </button>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                ))}
             </div>
          </div>
        </div>
      )}
    </div>
  );
};

// --- MAIN VIEW COMPONENT (UPDATED LAYOUT) ---
const CheckInView = () => {
  return (
    // 'flex-row' creates the Sidebar Layout
    <div className="flex flex-row h-screen overflow-hidden bg-gray-100">
      
      {/* LEFT: Passenger List (Main Content) */}
      <div className="flex-1 overflow-y-auto">
        <PassengerList />
      </div>

      {/* RIGHT: Vertical Seat Map (Sidebar) */}
      <SeatMap />
      
    </div>
  );
};

export default CheckInView;



