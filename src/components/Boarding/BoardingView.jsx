import { useMemo, useState } from 'react';
import { Check, ChevronDown, GripHorizontal, Pause, Play, Search, StopCircle } from 'lucide-react';

const mockPassengers = [
  { seq: '001', name: 'John Doe', seat: '1A', bags: 2, group: 'A', status: 'Ready' },
  { seq: '002', name: 'Jane Smith', seat: '1B', bags: 1, group: 'A', status: 'Ready' },
  { seq: '003', name: 'Leonie Green', seat: '4F', bags: 0, group: 'C', status: 'Ready' },
  { seq: '004', name: 'Martin Sousa', seat: '7B', bags: 1, group: 'B', status: 'Hold' },
];

const statusColors = {
  Ready: 'text-emerald-700 bg-emerald-100',
  Boarded: 'text-blue-700 bg-blue-100',
  Hold: 'text-amber-700 bg-amber-100',
  Issue: 'text-red-700 bg-red-100',
};

const BoardingView = () => {
  const [filter, setFilter] = useState('All');
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState([]);
  const [passengers, setPassengers] = useState(mockPassengers);

  const totals = useMemo(() => {
    const boarded = passengers.filter((p) => p.status === 'Boarded').length;
    const ready = passengers.filter((p) => p.status === 'Ready').length;
    const hold = passengers.filter((p) => p.status === 'Hold').length;
    const issues = passengers.filter((p) => p.status === 'Issue').length;
    return { boarded, ready, hold, issues, total: passengers.length };
  }, [passengers]);

  const filtered = passengers.filter((p) => {
    const matchFilter = filter === 'All' ? true : p.status === filter;
    const term = search.trim().toLowerCase();
    const matchSearch =
      term === '' ||
      p.name.toLowerCase().includes(term) ||
      p.seq.toLowerCase().includes(term) ||
      p.seat.toLowerCase().includes(term);
    return matchFilter && matchSearch;
  });

  const toggleSelect = (seq) => {
    setSelected((prev) =>
      prev.includes(seq) ? prev.filter((id) => id !== seq) : [...prev, seq]
    );
  };

  const bulkBoard = () => {
    if (!selected.length) return;
    setPassengers((prev) =>
      prev.map((p) =>
        selected.includes(p.seq) ? { ...p, status: 'Boarded' } : p
      )
    );
    setSelected([]);
  };

  const markHold = (seq) => {
    setPassengers((prev) =>
      prev.map((p) => (p.seq === seq ? { ...p, status: 'Hold' } : p))
    );
  };

  const unboardOne = (seq) => {
    setPassengers((prev) =>
      prev.map((p) => (p.seq === seq ? { ...p, status: 'Ready' } : p))
    );
    setSelected((prev) => prev.filter((id) => id !== seq));
  };

  const boardOne = (seq) => {
    setPassengers((prev) =>
      prev.map((p) => (p.seq === seq ? { ...p, status: 'Boarded' } : p))
    );
    setSelected((prev) => prev.filter((id) => id !== seq));
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      <div className="p-6 border-b border-gray-200 flex flex-col gap-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-xl font-bold text-gray-900">Boarding Control</h2>
            <p className="text-sm text-gray-500">
              Manage boarding status, holds, and exceptions.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <span className="font-semibold text-gray-900">{totals.boarded}</span> boarded
              <div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-blue-600"
                  style={{ width: `${(totals.boarded / Math.max(totals.total, 1)) * 100}%` }}
                />
              </div>
              <span className="text-gray-400">/ {totals.total}</span>
            </div>
            <button className="inline-flex items-center gap-2 px-3 py-2 text-sm font-semibold text-white bg-[#003366] hover:bg-[#004080] rounded-lg">
              <StopCircle className="w-4 h-4" />
              End Boarding
            </button>
            <button className="inline-flex items-center gap-2 px-3 py-2 text-sm font-semibold text-[#003366] border border-[#003366] rounded-lg hover:bg-[#003366] hover:text-white">
              <Check className="w-4 h-4" />
              Print Boarding List
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="col-span-1 bg-gray-50 border border-gray-200 rounded-lg p-4">
            <h3 className="text-sm font-semibold text-gray-800 mb-3">Flight Overview</h3>
            <div className="space-y-2 text-sm text-gray-700">
              <p><span className="text-gray-500">Gate:</span> 10</p>
              <p><span className="text-gray-500">ETD:</span> 20:00</p>
              <p><span className="text-gray-500">ATD:</span> 20:30</p>
              <p><span className="text-gray-500">Aircraft:</span> A321 | Seats: 144</p>
            </div>
            <div className="mt-4 flex items-center gap-3">
              <div className="w-20 h-20 rounded-full border-8 border-blue-100 flex items-center justify-center">
                <div className="w-14 h-14 rounded-full border-6 border-blue-600 flex items-center justify-center text-lg font-bold text-blue-700">
                  {Math.round((totals.boarded / Math.max(totals.total, 1)) * 100)}%
                </div>
              </div>
              <div className="text-sm text-gray-700">
                <p>
                  Boarded: <span className="font-semibold">{totals.boarded}</span> /{' '}
                  <span className="text-gray-500">{totals.total}</span>
                </p>
                <p>
                  Remaining:{' '}
                  <span className="font-semibold">
                    {Math.max(totals.total - totals.boarded, 0)}
                  </span>
                </p>
              </div>
            </div>
            <button className="mt-4 w-full text-sm font-semibold text-[#003366] border border-[#003366] rounded-lg py-2 hover:bg-[#003366] hover:text-white">
              View Flight Manifest
            </button>
          </div>

          <div className="col-span-2">
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
              <div className="flex flex-wrap items-center gap-3 mb-4">
                <div className="flex gap-2">
                  {['All', 'Ready', 'Boarded', 'Hold', 'Issue'].map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setFilter(tab)}
                      className={`px-3 py-1.5 text-sm font-semibold rounded-md border ${
                        filter === tab
                          ? 'bg-white text-[#003366] border-[#003366]'
                          : 'bg-white text-gray-600 border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      {tab}
                    </button>
                  ))}
                </div>
                <div className="flex-1 min-w-[200px] relative">
                  <Search className="w-4 h-4 text-gray-400 absolute left-3 top-2.5 pointer-events-none" />
                  <input
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Scan boarding pass / search name, seat, or seq"
                    className="w-full pl-9 pr-10 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#003366]/50"
                  />
                  <ChevronDown className="w-4 h-4 text-gray-400 absolute right-3 top-2.5" />
                </div>
              </div>

              <div className="border border-gray-200 rounded-lg overflow-hidden">
                <table className="w-full text-sm text-left">
                  <thead className="bg-gray-100 text-gray-600 font-semibold uppercase text-xs">
                    <tr>
                      <th className="p-3 w-10">
                        <input
                          type="checkbox"
                          checked={selected.length === filtered.length && filtered.length > 0}
                          onChange={(e) =>
                            setSelected(e.target.checked ? filtered.map((p) => p.seq) : [])
                          }
                          className="rounded"
                        />
                      </th>
                      <th className="p-3">Seq</th>
                      <th className="p-3">Name</th>
                      <th className="p-3">Seat</th>
                      <th className="p-3">Bags</th>
                      <th className="p-3">Group</th>
                      <th className="p-3">Status</th>
                      <th className="p-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {filtered.map((p) => (
                      <tr
                        key={p.seq}
                        className={`hover:bg-gray-50 ${selected.includes(p.seq) ? 'bg-blue-50/60' : ''}`}
                      >
                        <td className="p-3">
                          <input
                            type="checkbox"
                            checked={selected.includes(p.seq)}
                            onChange={() => toggleSelect(p.seq)}
                            className="rounded"
                          />
                        </td>
                        <td className="p-3 font-semibold text-gray-900">{p.seq}</td>
                        <td className="p-3 text-gray-800 font-medium">{p.name}</td>
                        <td className="p-3 font-semibold">{p.seat}</td>
                        <td className="p-3">{p.bags}</td>
                        <td className="p-3">{p.group}</td>
                        <td className="p-3">
                          <span className={`px-2 py-1 rounded text-xs font-semibold ${statusColors[p.status]}`}>
                            {p.status}
                          </span>
                        </td>
                        <td className="p-3 text-right">
                          <div className="flex justify-end gap-2">
                            {p.status === 'Boarded' ? (
                              <button
                                onClick={() => unboardOne(p.seq)}
                                className="px-3 py-1 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded"
                              >
                                Unboard
                              </button>
                            ) : (
                              <button
                                onClick={() => boardOne(p.seq)}
                                className="px-3 py-1 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded"
                              >
                                Board
                              </button>
                            )}
                            <button
                              onClick={() => markHold(p.seq)}
                              className="px-3 py-1 text-xs font-semibold text-amber-700 bg-amber-100 border border-amber-200 rounded hover:bg-amber-200"
                            >
                              Hold
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                    {filtered.length === 0 && (
                      <tr>
                        <td colSpan={8} className="p-6 text-center text-gray-500">
                          No passengers match the current filters.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              <div className="flex items-center justify-between mt-4">
                <div className="flex items-center gap-6 text-sm text-gray-700">
                  <div>Total: <span className="font-semibold">{totals.total}</span></div>
                  <div>Boarded: <span className="font-semibold text-blue-700">{totals.boarded}</span></div>
                  <div>Remaining: <span className="font-semibold">{Math.max(totals.total - totals.boarded, 0)}</span></div>
                  <div>Hold: <span className="font-semibold text-amber-700">{totals.hold}</span></div>
                </div>
                <div className="flex items-center gap-3">
                  <button
                    onClick={bulkBoard}
                    className="px-4 py-2 text-sm font-semibold text-white bg-[#003366] hover:bg-[#004080] rounded-lg disabled:opacity-60"
                    disabled={!selected.length}
                  >
                    Board Selected
                  </button>
                  <button className="px-4 py-2 text-sm font-semibold text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-100">
                    <GripHorizontal className="w-4 h-4 inline mr-2" />
                    Quick Actions
                  </button>
                </div>
              </div>

              <div className="mt-4 h-2 w-full bg-gray-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-blue-600"
                  style={{ width: `${(totals.boarded / Math.max(totals.total, 1)) * 100}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 text-xs text-gray-600 border-t border-gray-200 pt-4">
          <span className="text-emerald-700 font-semibold">LEONIE GREEN boarded successfully (Seat 4F)</span>
          <span className="text-red-600 font-semibold">Seat conflict: MARTIN SOUSA — 7B unavailable</span>
          <span className="text-emerald-700 font-semibold">JOHN DOE boarded successfully (Seat 1A)</span>
          <span className="text-emerald-700 font-semibold">JANE SMITH boarded successfully (Seat 1B)</span>
        </div>
      </div>
    </div>
  );
};

export default BoardingView;
