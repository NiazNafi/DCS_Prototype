import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { PlusCircle, Save, XCircle, Trash2, Grid, Minus } from 'lucide-react';

const storageKey = 'dcs_aircraft_data';

const defaultAircraftData = [
  { id: 'aircraft-1', type: 'Boeing 777', registration: 'S2-AAA', config: 'First: 02 / Business: 16 / Economy: 42', status: 'Active' },
  { id: 'aircraft-2', type: 'Airbus A320', registration: 'S2-AAB', config: 'Economy: 144 / Premium: 30', status: 'Inactive' },
  { id: 'aircraft-3', type: 'ATR 72-600', registration: 'S2-AAI', config: 'Economy: 72', status: 'Active' },
];

const normalizeAircraft = (list) =>
  list.map((item, idx) => ({
    id: item.id || `aircraft-${idx + 1}-${item.registration || Date.now()}`,
    status: item.status || 'Active',
    config: item.config || 'Economy: 144',
    seatmap: item.seatmap,
    ...item,
  }));

const cabinColors = {
  First: 'bg-sky-200 border-sky-400 text-sky-900',
  Business: 'bg-cyan-200 border-cyan-400 text-cyan-900',
  Premium: 'bg-amber-200 border-amber-400 text-amber-900',
  Economy: 'bg-emerald-200 border-emerald-400 text-emerald-900',
  Unassigned: 'bg-slate-200 border-slate-400 text-slate-900',
  Default: 'bg-gray-200 border-gray-500 text-gray-900',
};

// Inline color styles to ensure visibility even if utility classes are purged
const cabinColorStyles = {
  First: { backgroundColor: '#e0f2fe', borderColor: '#38bdf8', color: '#0c4a6e' },
  Business: { backgroundColor: '#cffafe', borderColor: '#06b6d4', color: '#0f172a' },
  Premium: { backgroundColor: '#fef3c7', borderColor: '#f59e0b', color: '#92400e' },
  Economy: { backgroundColor: '#d1fae5', borderColor: '#10b981', color: '#065f46' },
  Unassigned: { backgroundColor: '#e2e8f0', borderColor: '#64748b', color: '#0f172a' },
  Default: { backgroundColor: '#e5e7eb', borderColor: '#6b7280', color: '#111827' },
  Blocked: { backgroundColor: '#d1d5db', borderColor: '#9ca3af', color: '#374151' },
};

const CABIN_TYPES = ['First', 'Business', 'Premium', 'Economy', 'Unassigned'];

// Compact but readable seat sizes (explicit pixels so Tailwind doesn’t drop them)
const seatSizeClass = (cabin) => {
  if (cabin === 'First') return 'w-[36px] h-[36px] text-[10px]';
  if (cabin === 'Business') return 'w-[32px] h-[32px] text-[10px]';
  if (cabin === 'Premium') return 'w-[30px] h-[30px] text-[9px]';
  return 'w-[28px] h-[28px] text-[9px]';
};

const labelRange = (start, end) => {
  if (!start || !end) return [];
  const isNum = !Number.isNaN(Number(start)) && !Number.isNaN(Number(end));
  if (isNum) {
    const s = Number(start);
    const e = Number(end);
    if (e < s) return [];
    return Array.from({ length: e - s + 1 }, (_, i) => `${s + i}`);
  }
  const sCode = start.toUpperCase().charCodeAt(0);
  const eCode = end.toUpperCase().charCodeAt(0);
  if (eCode < sCode) return [];
  return Array.from({ length: eCode - sCode + 1 }, (_, i) => String.fromCharCode(sCode + i));
};

const layoutPattern = (layout, length) => {
  const groups = layout
    .split('-')
    .map((g) => Number(g.trim()))
    .filter((n) => !Number.isNaN(n) && n > 0);
  if (!groups.length) return Array.from({ length }, () => 'seat');
  const pattern = [];
  groups.forEach((count, idx) => {
    for (let i = 0; i < count; i++) pattern.push('seat');
    if (idx < groups.length - 1) pattern.push('aisle');
  });
  if (pattern.length >= length) return pattern.slice(0, length);
  while (pattern.length < length) pattern.push('blocked');
  return pattern;
};

const buildCabinMap = (cabin) => {
  const rows = labelRange(cabin.startRow, cabin.endRow);
  const cols = labelRange(cabin.startCol, cabin.endCol);
  const pattern = layoutPattern(cabin.layout || '3-3', cols.length || 0);
  const grid = rows.map((rLabel) =>
    cols.map((cLabel, idx) => {
      const type = pattern[idx] === 'aisle' ? 'blocked' : 'seat';
      return { row: rLabel, col: cLabel, type, cabin: cabin.name, tags: [], zone: '' };
    })
  );
  return { rows, cols, grid };
};

const ensureSeatmap = (aircraft) => {
  const base = aircraft?.seatmap || { cabins: [], cabinMaps: {} };
  const cabins = base.cabins || [];
  let cabinMaps = base.cabinMaps || {};
  if (!Object.keys(cabinMaps).length && cabins.length) {
    cabinMaps = {};
    cabins.forEach((c) => {
      const id = c.id || `cabin-${Date.now()}`;
      cabinMaps[id] = buildCabinMap(c);
    });
  }
  return { cabins, cabinMaps };
};

const CreateSeatmap = () => {
  const navigate = useNavigate();
  const params = useParams();

  const [aircraftList, setAircraftList] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [showActiveOnly, setShowActiveOnly] = useState(false);
  const [seatmap, setSeatmap] = useState(ensureSeatmap({}));
  const [message, setMessage] = useState('');
  const [activeTool, setActiveTool] = useState('seat'); // seat | blocked | exit | vip | cip | wchr | bassinet | washroom | galley | zone
  const [zoneName, setZoneName] = useState('');
  const [zoneBlocks, setZoneBlocks] = useState({});

  const planeBgStyle = {
    backgroundImage: [
      "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 200 600' opacity='0.10'><path d='M100 0 L125 80 L125 500 L100 600 L75 500 L75 80 Z' fill='%23111827'/></svg>\")",
      'linear-gradient(135deg, rgba(15,23,42,0.07) 0%, rgba(15,23,42,0.04) 50%, rgba(15,23,42,0.07) 100%)',
      'repeating-linear-gradient(90deg, rgba(255,255,255,0.05) 0px, rgba(255,255,255,0.05) 2px, transparent 12px)',
      'radial-gradient(ellipse at 50% -10%, rgba(59,130,246,0.14), transparent 55%)',
      'radial-gradient(ellipse at 50% 110%, rgba(14,165,233,0.14), transparent 55%)',
    ].join(','),
    backgroundSize: '160px 520px, 100% 100%, 18px 18px, 100% 100%, 100% 100%',
    backgroundRepeat: 'no-repeat, no-repeat, repeat, no-repeat, no-repeat',
    backgroundPosition: 'center center, center center, center center, center center, center center',
  };

  const seatmapPanelStyle = {
    backgroundImage: [
      "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 400 200' opacity='0.10'><path d='M10 100 L140 100 L210 60 L380 60 L320 100 L380 140 L210 140 L140 100 L10 100 L0 90 L0 110 Z' fill='%23111827'/></svg>\")",
      'linear-gradient(120deg, rgba(255,255,255,0.65), rgba(255,255,255,0.55))',
    ].join(','),
    backgroundSize: '320px 140px, 100% 100%',
    backgroundRepeat: 'no-repeat, no-repeat',
    backgroundPosition: '95% 10%, center center',
  };

  useEffect(() => {
    const stored = localStorage.getItem(storageKey);
    if (stored) {
      const parsed = normalizeAircraft(JSON.parse(stored));
      setAircraftList(parsed);
      const picked = params.id ? parsed.find((a) => a.id === params.id) : parsed[0];
      if (picked) {
        setSelectedId(picked.id);
        setSeatmap(ensureSeatmap(picked));
      } else {
        setSelectedId(null);
      }
    } else {
      setAircraftList(defaultAircraftData);
    }
  }, [params.id]);

  useEffect(() => {
    if (aircraftList.length) {
      localStorage.setItem(storageKey, JSON.stringify(aircraftList));
    }
  }, [aircraftList]);

  const filteredAircraft = useMemo(() => {
    if (!showActiveOnly) return aircraftList;
    return aircraftList.filter((a) => a.status === 'Active');
  }, [aircraftList, showActiveOnly]);

  const selectedAircraft = useMemo(() => filteredAircraft.find((a) => a.id === selectedId), [filteredAircraft, selectedId]);

  const cabinSeatCount = useMemo(() => {
    const counts = {};
    Object.values(seatmap.cabinMaps || {}).forEach((map, idx) => {
      const cabinName = seatmap.cabins[idx]?.name || 'Cabin';
      map.grid.forEach((row) =>
        row.forEach((cell) => {
          if (cell.type === 'seat') {
            counts[cell.cabin || cabinName] = (counts[cell.cabin || cabinName] || 0) + 1;
          }
        })
      );
    });
    return counts;
  }, [seatmap]);

  const totalSeats = useMemo(
    () =>
      Object.values(seatmap.cabinMaps || {}).reduce(
        (sum, map) => sum + map.grid.flat().filter((c) => c.type === 'seat').length,
        0
      ),
    [seatmap]
  );

  const updateCell = (cabinId, rowIdx, colIdx, updates) => {
    setSeatmap((prev) => {
      const map = prev.cabinMaps[cabinId];
      if (!map) return prev;
      const nextGrid = map.grid.map((r, rIdx) =>
        r.map((c, cIdx) => {
          if (rIdx === rowIdx && cIdx === colIdx) {
            return { ...c, ...updates };
          }
          return c;
        })
      );
      return { ...prev, cabinMaps: { ...prev.cabinMaps, [cabinId]: { ...map, grid: nextGrid } } };
    });
  };

  const applyToolToCell = (cabinId, rowIdx, colIdx) => {
    const map = seatmap.cabinMaps[cabinId];
    if (!map) return;
    const cell = map.grid[rowIdx][colIdx];
    const next = { ...cell };
    if (!next.tags) next.tags = [];

    if (activeTool === 'seat') {
      next.type = 'seat';
      updateCell(cabinId, rowIdx, colIdx, next);
      return;
    }
    if (activeTool === 'blocked') {
      updateCell(cabinId, rowIdx, colIdx, { ...next, type: 'blocked', tags: [], zone: next.zone || '' });
      return;
    }

    const featureTags = ['exit', 'vip', 'cip', 'wchr', 'bassinet', 'washroom', 'galley'];
    if (featureTags.includes(activeTool)) {
      next.type = 'seat';
      if (!next.tags.includes(activeTool)) next.tags.push(activeTool);
      updateCell(cabinId, rowIdx, colIdx, next);
      return;
    }

    if (activeTool === 'zone') {
      next.type = 'seat';
      next.zone = zoneName || '';
      updateCell(cabinId, rowIdx, colIdx, next);
    }
  };

  const removeRow = (cabinId) => {
    setSeatmap((prev) => {
      const map = prev.cabinMaps[cabinId];
      if (!map || !map.rows.length) return prev;
      const nextRows = map.rows.slice(0, -1);
      const nextGrid = map.grid.slice(0, -1);
      return { ...prev, cabinMaps: { ...prev.cabinMaps, [cabinId]: { ...map, rows: nextRows, grid: nextGrid } } };
    });
  };

  const removeCol = (cabinId) => {
    setSeatmap((prev) => {
      const map = prev.cabinMaps[cabinId];
      if (!map || !map.cols.length) return prev;
      const nextCols = map.cols.slice(0, -1);
      const nextGrid = map.grid.map((row) => row.slice(0, -1));
      return { ...prev, cabinMaps: { ...prev.cabinMaps, [cabinId]: { ...map, cols: nextCols, grid: nextGrid } } };
    });
  };

  const updateCabinField = (id, key, value) => {
    setSeatmap((prev) => ({
      ...prev,
      cabins: prev.cabins.map((c) => (c.id === id ? { ...c, [key]: value } : c)),
    }));
  };

  const regenerateGridFromCabins = () => {
    if (!seatmap.cabins.length) return;
    const cabinMaps = {};
    seatmap.cabins.forEach((cabin) => {
      cabinMaps[cabin.id] = buildCabinMap(cabin);
    });
    setSeatmap((prev) => ({ ...prev, cabinMaps }));
  };

  const addCabin = () => {
    const newCabin = {
      id: `cabin-${Date.now()}`,
      name: 'Economy',
      deck: 1,
      startRow: '1',
      endRow: '10',
      startCol: 'A',
      endCol: 'F',
      layout: '3-3',
    };
    setSeatmap((prev) => ({
      ...prev,
      cabins: [...prev.cabins, newCabin],
      cabinMaps: { ...prev.cabinMaps, [newCabin.id]: buildCabinMap(newCabin) },
    }));
  };

  const deleteCabin = (id) => {
    setSeatmap((prev) => {
      const nextMaps = { ...prev.cabinMaps };
      delete nextMaps[id];
      return { ...prev, cabins: prev.cabins.filter((c) => c.id !== id), cabinMaps: nextMaps };
    });
  };

  const updateRowLabel = (cabinId, idx, value) => {
    setSeatmap((prev) => {
      const map = prev.cabinMaps[cabinId];
      if (!map) return prev;
      const nextRows = [...map.rows];
      nextRows[idx] = value;
      const nextGrid = map.grid.map((row, rIdx) => (rIdx === idx ? row.map((cell) => ({ ...cell, row: value })) : row));
      return { ...prev, cabinMaps: { ...prev.cabinMaps, [cabinId]: { ...map, rows: nextRows, grid: nextGrid } } };
    });
  };

  const updateColLabel = (cabinId, idx, value) => {
    setSeatmap((prev) => {
      const map = prev.cabinMaps[cabinId];
      if (!map) return prev;
      const nextCols = [...map.cols];
      nextCols[idx] = value;
      const nextGrid = map.grid.map((row) => row.map((cell, cIdx) => (cIdx === idx ? { ...cell, col: value } : cell)));
      return { ...prev, cabinMaps: { ...prev.cabinMaps, [cabinId]: { ...map, cols: nextCols, grid: nextGrid } } };
    });
  };

  const assignRowZone = (cabinId, rowIdx, zone) => {
    setSeatmap((prev) => {
      const map = prev.cabinMaps[cabinId];
      if (!map) return prev;
      const nextGrid = map.grid.map((row, rIdx) =>
        row.map((cell) => {
          if (rIdx !== rowIdx) return cell;
          if (cell.type !== 'seat') return { ...cell, zone };
          return { ...cell, zone };
        })
      );
      return { ...prev, cabinMaps: { ...prev.cabinMaps, [cabinId]: { ...map, grid: nextGrid } } };
    });
  };

  const updateZoneBlockField = (cabinId, key, value) => {
    setZoneBlocks((prev) => ({
      ...prev,
      [cabinId]: {
        ...(prev[cabinId] || {}),
        [key]: value,
      },
    }));
  };

  const applyZoneBlock = (cabinId) => {
    const block = zoneBlocks[cabinId] || {};
    const zone = zoneName || '';
    const map = seatmap.cabinMaps[cabinId];
    if (!map || !zone) return;
    const startLabel = block.start || map.rows[0];
    const endLabel = block.end || map.rows[map.rows.length - 1];
    const startIdx = map.rows.findIndex((r) => r === startLabel);
    const endIdx = map.rows.findIndex((r) => r === endLabel);
    if (startIdx === -1 || endIdx === -1) return;
    const [lo, hi] = startIdx <= endIdx ? [startIdx, endIdx] : [endIdx, startIdx];
    setSeatmap((prev) => {
      const m = prev.cabinMaps[cabinId];
      if (!m) return prev;
      const nextGrid = m.grid.map((row, rIdx) =>
        row.map((cell) => {
          if (rIdx < lo || rIdx > hi) return cell;
          return { ...cell, zone };
        })
      );
      return { ...prev, cabinMaps: { ...prev.cabinMaps, [cabinId]: { ...m, grid: nextGrid } } };
    });
  };

  const toggleColumnAisle = (cabinId, colIdx) => {
    setSeatmap((prev) => {
      const map = prev.cabinMaps[cabinId];
      if (!map || !map.grid.length || colIdx < 0 || colIdx >= map.cols.length) return prev;
      const isAllBlocked = map.grid.every((row) => row[colIdx]?.type === 'blocked');
      const nextGrid = map.grid.map((row) =>
        row.map((cell, cIdx) => {
          if (cIdx !== colIdx) return cell;
          if (isAllBlocked) {
            return { ...cell, type: 'seat', tags: cell.tags || [], zone: cell.zone || '' };
          }
          return { ...cell, type: 'blocked', tags: [], zone: cell.zone || '' };
        })
      );
      return { ...prev, cabinMaps: { ...prev.cabinMaps, [cabinId]: { ...map, grid: nextGrid } } };
    });
  };

  const handleSave = () => {
    if (!selectedAircraft) return;
    const summary = `Total: ${totalSeats} | ${Object.entries(cabinSeatCount)
      .map(([key, val]) => `${key}: ${val}`)
      .join(' · ')}`;
    const updated = aircraftList.map((a) =>
      a.id === selectedAircraft.id
        ? {
            ...a,
            seatmap: {
              ...seatmap,
              summary,
            },
          }
        : a
    );
    setAircraftList(updated);
    localStorage.setItem(storageKey, JSON.stringify(updated));
    setMessage('Seatmap saved and linked to aircraft.');
    setTimeout(() => setMessage(''), 2000);
  };

  const handleActivate = () => {
    handleSave();
    navigate('/admin/aircraft');
  };

  const tagBadge = (tag) => (
    <span key={tag} className="inline-flex items-center px-1 py-0.5 text-[9px] font-semibold rounded bg-white/80 text-gray-800 border border-gray-200">
      {tag === 'exit' && 'Exit'}
      {tag === 'vip' && 'VIP'}
      {tag === 'cip' && 'CIP'}
      {tag === 'wchr' && 'WCHR'}
      {tag === 'bassinet' && 'BASS'}
      {tag === 'washroom' && 'W/R'}
      {tag === 'galley' && 'GAL'}
    </span>
  );

  return (
    <div className="p-6 space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-500">Seatmap Builder</p>
          <h1 className="text-2xl font-semibold text-gray-800">Create Seat Map</h1>
          {message && <p className="text-sm text-green-600 mt-1">{message}</p>}
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={handleActivate}
            className="inline-flex items-center space-x-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition"
          >
            <Save className="w-4 h-4" />
            <span className="text-sm font-semibold">Save & Activate</span>
          </button>
          <button
            onClick={() => navigate('/admin/aircraft')}
            className="inline-flex items-center space-x-2 text-gray-700 border border-gray-300 px-4 py-2 rounded-lg hover:bg-gray-100"
          >
            <XCircle className="w-4 h-4" />
            <span className="text-sm font-semibold">Cancel</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 items-start">
        <div className="space-y-4">
          <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-4 space-y-4">
            <h2 className="text-sm font-semibold text-gray-800">Aircraft Identification</h2>
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Aircraft</label>
              <select
                value={selectedId || ''}
                onChange={(e) => {
                  const next = aircraftList.find((a) => a.id === e.target.value);
                  setSelectedId(e.target.value);
                  setSeatmap(ensureSeatmap(next));
                }}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {filteredAircraft.length === 0 && <option value="">No aircraft available</option>}
                {filteredAircraft.map((a) => (
                  <option key={a.id} value={a.id}>
                    {a.type} - {a.registration}
                  </option>
                ))}
              </select>
            </div>
            <label className="flex items-center space-x-2 text-sm text-gray-700">
              <input
                type="checkbox"
                checked={showActiveOnly}
                onChange={(e) => setShowActiveOnly(e.target.checked)}
                className="h-4 w-4 text-[#003366] border-gray-300 rounded"
              />
              <span>Show only active aircraft</span>
            </label>
            {selectedAircraft && (
              <>
                <div className="text-sm text-gray-700">
                  <p>
                    Status: <span className="font-semibold">{selectedAircraft.status}</span>
                  </p>
                  <p className="mt-1">Config: {selectedAircraft.config}</p>
                </div>
                <div className="text-sm text-gray-700">
                  <p>
                    Total Seats: <span className="font-semibold">{totalSeats}</span>
                  </p>
                  <p className="mt-1">
                    First: {cabinSeatCount.First || 0} · Business: {cabinSeatCount.Business || 0} · Premium: {cabinSeatCount.Premium || 0} · Economy: {cabinSeatCount.Economy || 0}
                  </p>
                </div>
              </>
            )}
            <div className="flex items-center space-x-2 text-xs text-gray-600">
              <Grid className="w-4 h-4" />
              <span>Set cabin ranges, then Generate Seats. Each cabin block is independent.</span>
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-4 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-semibold text-gray-800">Cabin Layout & Configuration</h2>
              <div className="flex items-center space-x-2">
                <button
                  onClick={regenerateGridFromCabins}
                  disabled={!seatmap.cabins.length}
                  className={`inline-flex items-center space-x-2 text-sm font-semibold border px-3 py-1.5 rounded-lg ${
                    seatmap.cabins.length ? 'text-green-700 border-green-200 hover:bg-green-50' : 'text-gray-400 border-gray-200 cursor-not-allowed'
                  }`}
                  title="Generate seats from cabin ranges & layout"
                >
                  <Grid className="w-4 h-4" />
                  <span>Generate Seats</span>
                </button>
                <button
                  onClick={addCabin}
                  className="inline-flex items-center space-x-2 text-sm font-semibold text-[#003366] border border-blue-200 px-3 py-1.5 rounded-lg hover:bg-blue-50"
                >
                  <PlusCircle className="w-4 h-4" />
                  <span>Add Cabin</span>
                </button>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-sm border border-gray-200 rounded-lg overflow-hidden">
                <thead className="bg-gray-50">
                  <tr className="text-gray-700">
                    <th className="px-3 py-2 text-left font-semibold">Order</th>
                    <th className="px-3 py-2 text-left font-semibold">Cabin</th>
                    <th className="px-3 py-2 text-left font-semibold">Deck</th>
                    <th className="px-3 py-2 text-left font-semibold">Start Row</th>
                    <th className="px-3 py-2 text-left font-semibold">End Row</th>
                    <th className="px-3 py-2 text-left font-semibold">Start Col</th>
                    <th className="px-3 py-2 text-left font-semibold">End Col</th>
                    <th className="px-3 py-2 text-left font-semibold">Seat Layout (e.g., 3-3)</th>
                    <th className="px-3 py-2 text-left font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {seatmap.cabins.map((cabin, idx) => (
                    <tr key={cabin.id} className="border-t border-gray-100">
                      <td className="px-3 py-2">{idx + 1}</td>
                      <td className="px-3 py-2">
                        <select
                          value={cabin.name}
                          onChange={(e) => updateCabinField(cabin.id, 'name', e.target.value)}
                          className="w-full px-2 py-1 border border-gray-200 rounded bg-white"
                        >
                          {CABIN_TYPES.map((type) => (
                            <option key={type} value={type}>
                              {type}
                            </option>
                          ))}
                        </select>
                      </td>
                      <td className="px-3 py-2">
                        <input
                          type="number"
                          value={cabin.deck ?? 1}
                          min={1}
                          onChange={(e) => updateCabinField(cabin.id, 'deck', Number(e.target.value))}
                          className="w-full px-2 py-1 border border-gray-200 rounded"
                        />
                      </td>
                      <td className="px-3 py-2">
                        <input
                          value={cabin.startRow || ''}
                          onChange={(e) => updateCabinField(cabin.id, 'startRow', e.target.value)}
                          className="w-full px-2 py-1 border border-gray-200 rounded"
                          placeholder="e.g., 1"
                        />
                      </td>
                      <td className="px-3 py-2">
                        <input
                          value={cabin.endRow || ''}
                          onChange={(e) => updateCabinField(cabin.id, 'endRow', e.target.value)}
                          className="w-full px-2 py-1 border border-gray-200 rounded"
                          placeholder="e.g., 20"
                        />
                      </td>
                      <td className="px-3 py-2">
                        <input
                          value={cabin.startCol || ''}
                          onChange={(e) => updateCabinField(cabin.id, 'startCol', e.target.value)}
                          className="w-full px-2 py-1 border border-gray-200 rounded"
                          placeholder="e.g., A"
                        />
                      </td>
                      <td className="px-3 py-2">
                        <input
                          value={cabin.endCol || ''}
                          onChange={(e) => updateCabinField(cabin.id, 'endCol', e.target.value)}
                          className="w-full px-2 py-1 border border-gray-200 rounded"
                          placeholder="e.g., F"
                        />
                      </td>
                      <td className="px-3 py-2">
                        <input
                          value={cabin.layout || ''}
                          onChange={(e) => updateCabinField(cabin.id, 'layout', e.target.value)}
                          className="w-full px-2 py-1 border border-gray-200 rounded"
                          placeholder="e.g., 3-3 or 1-1"
                        />
                      </td>
                      <td className="px-3 py-2">
                        <button onClick={() => deleteCabin(cabin.id)} className="text-red-600 hover:text-red-700" title="Delete cabin">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-4 space-y-4" style={seatmapPanelStyle}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-gray-800">Seatmap</p>
              <p className="text-xs text-gray-500">Independent cabin blocks</p>
            </div>
            <div className="text-xs text-gray-600">
              <p>
                Total: <span className="font-semibold text-gray-800">{totalSeats}</span>
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 mb-1 text-xs">
            {[
              { key: 'seat', label: 'Seat', color: 'bg-white text-gray-800 border-gray-300' },
              { key: 'blocked', label: 'Block/Aisle', color: 'bg-gray-200 text-gray-800 border-gray-300' },
              { key: 'exit', label: 'Exit', color: 'bg-red-100 text-red-700 border-red-200' },
              { key: 'vip', label: 'VIP', color: 'bg-indigo-100 text-indigo-700 border-indigo-200' },
              { key: 'cip', label: 'CIP', color: 'bg-blue-100 text-blue-700 border-blue-200' },
              { key: 'wchr', label: 'WCHR', color: 'bg-amber-100 text-amber-800 border-amber-200' },
              { key: 'bassinet', label: 'Bassinet', color: 'bg-teal-100 text-teal-800 border-teal-200' },
              { key: 'washroom', label: 'Washroom', color: 'bg-gray-100 text-gray-800 border-gray-200' },
              { key: 'galley', label: 'Galley', color: 'bg-green-100 text-green-800 border-green-200' },
            ].map((tool) => (
              <button
                key={tool.key}
                onClick={() => setActiveTool(tool.key)}
                className={`px-3 py-1.5 rounded-full border text-[11px] font-semibold transition ${
                  activeTool === tool.key ? 'ring-2 ring-offset-1 ring-[#003366]' : ''
                } ${tool.color}`}
              >
                {tool.label}
              </button>
            ))}
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setActiveTool('zone')}
                className={`px-3 py-1.5 rounded-full border text-[11px] font-semibold transition ${
                  activeTool === 'zone' ? 'ring-2 ring-offset-1 ring-[#003366]' : ''
                } bg-white text-gray-800 border-gray-300`}
              >
                Zone
              </button>
              <input
                value={zoneName}
                onChange={(e) => setZoneName(e.target.value)}
                placeholder="Zone name"
                className="px-2 py-1 border border-gray-200 rounded text-[11px] w-28"
              />
            </div>
            <span className="text-[11px] text-gray-600">Click a cell to apply the selected tool.</span>
          </div>

          <div className="flex flex-wrap items-center gap-3 text-xs text-gray-600">
            <div className="flex items-center space-x-1">
              <div className="w-4 h-4 border border-blue-300 bg-blue-100"></div>
              <span>First</span>
            </div>
            <div className="flex items-center space-x-1">
              <div className="w-4 h-4 border border-purple-300 bg-purple-100"></div>
              <span>Business</span>
            </div>
            <div className="flex items-center space-x-1">
              <div className="w-4 h-4 border border-cyan-300 bg-cyan-100"></div>
              <span>Premium</span>
            </div>
            <div className="flex items-center space-x-1">
              <div className="w-4 h-4 border border-emerald-300 bg-emerald-100"></div>
              <span>Economy</span>
            </div>
            <div className="flex items-center space-x-1">
              <div className="w-4 h-4 border border-amber-300 bg-amber-100"></div>
              <span>Unassigned</span>
            </div>
            <div className="flex items-center space-x-1">
              <div className="w-4 h-4 border border-gray-400 bg-gray-300"></div>
              <span>Blocked/Aisle</span>
            </div>
          </div>

          {seatmap.cabins.length === 0 && (
            <div className="p-4 border border-dashed border-gray-300 rounded-lg text-sm text-gray-600 bg-gray-50">
              Add cabins, set start/end rows and columns, then generate seats.
            </div>
          )}

                {seatmap.cabins.length > 0 && (
                  <div className="space-y-4">
                    {seatmap.cabins.map((cabin) => {
                      const map = seatmap.cabinMaps[cabin.id];
                      const colorClass = cabinColors[cabin.name] || cabinColors.Default;
                      const zoneBlock = zoneBlocks[cabin.id] || {};
                      return (
                  <div key={cabin.id} className="border border-gray-200 rounded-lg p-3 bg-white shadow-inner" style={planeBgStyle}>
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center space-x-2">
                              <div className={`w-3 h-3 rounded-full border ${colorClass.split(' ')[0]} ${colorClass.split(' ')[1]}`}></div>
                              <p className="text-sm font-semibold text-gray-800">{cabin.name} Cabin</p>
                              <span className="text-xs text-gray-500">Rows {cabin.startRow}-{cabin.endRow} · Cols {cabin.startCol}-{cabin.endCol}</span>
                            </div>
                            <div className="flex items-center gap-2 text-xs">
                              <button
                                onClick={() => removeRow(cabin.id)}
                                className="px-2 py-1 border border-gray-200 rounded text-red-700 hover:bg-red-50 flex items-center space-x-1"
                                title="Remove last row"
                              >
                                <Trash2 className="w-3 h-3" />
                                <span>Row</span>
                              </button>
                              <button
                                onClick={() => removeCol(cabin.id)}
                                className="px-2 py-1 border border-gray-200 rounded text-red-700 hover:bg-red-50 flex items-center space-x-1"
                                title="Remove last column"
                              >
                                <Trash2 className="w-3 h-3" />
                                <span>Col</span>
                              </button>
                            </div>
                          </div>

                          <div className="flex items-center gap-2 text-xs mb-2">
                            <span className="text-gray-600">Zone Block:</span>
                            <input
                              value={zoneBlock.start || ''}
                              onChange={(e) => updateZoneBlockField(cabin.id, 'start', e.target.value)}
                              placeholder="Start row"
                              className="w-16 px-2 py-1 border border-gray-200 rounded"
                            />
                            <input
                              value={zoneBlock.end || ''}
                              onChange={(e) => updateZoneBlockField(cabin.id, 'end', e.target.value)}
                              placeholder="End row"
                              className="w-16 px-2 py-1 border border-gray-200 rounded"
                            />
                            <button
                              onClick={() => applyZoneBlock(cabin.id)}
                              className="px-3 py-1 border border-blue-200 text-blue-700 rounded hover:bg-blue-50 font-semibold"
                              title="Apply current Zone name to rows in this range"
                            >
                              Apply Zone Block
                            </button>
                            <span className="text-gray-500">Uses current Zone name</span>
                          </div>

                    {!map || !map.rows.length || !map.cols.length ? (
                      <div className="p-3 border border-dashed border-gray-300 rounded text-xs text-gray-600 bg-gray-50">
                        Define start/end rows and columns, then click Generate Seats.
                      </div>
                    ) : (
                      <div className="overflow-auto">
                        {(() => {
                          const rowZones = map.grid.map((row) => (row.length && row.every((c) => c.zone === row[0].zone) ? row[0].zone : ''));
                          return (
                            <table className="text-center text-[11px] mx-auto relative">
                              <thead>
                                <tr>
                                  <th className="px-1.5 py-1"></th>
                                  {map.cols.map((col, idx) => (
                                    <th key={col + idx} className="px-1.5 py-1 font-semibold text-gray-700">
                                      <div className="flex flex-col items-center space-y-1">
                                        <input
                                          value={col}
                                          onChange={(e) => updateColLabel(cabin.id, idx, e.target.value)}
                                          className="w-10 px-1 py-0.5 border border-gray-200 rounded text-center text-[11px]"
                                        />
                                        <button
                                          onClick={() => toggleColumnAisle(cabin.id, idx)}
                                          className="px-1.5 py-0.5 text-[10px] border border-dashed border-gray-400 rounded hover:bg-gray-100"
                                          title="Vanish this column to create an aisle (click again to restore seats)"
                                        >
                                          Aisle
                                        </button>
                                      </div>
                                    </th>
                                  ))}
                                </tr>
                              </thead>
                              <tbody>
                                {map.grid.map((row, rIdx) => {
                                  const rowZone = rowZones[rIdx];
                                  const inZone = Boolean(rowZone);
                                  const isStart =
                                    inZone &&
                                    (rIdx === 0 || rowZones[rIdx - 1] !== rowZone);
                                  const isEnd = inZone && (rIdx === rowZones.length - 1 || rowZones[rIdx + 1] !== rowZone);
                                  const zoneStartIdx = isStart ? rIdx : null;
                                  const zoneEndIdx = (() => {
                                    if (!inZone) return null;
                                    let j = rIdx;
                                    while (j + 1 < rowZones.length && rowZones[j + 1] === rowZone) j++;
                                    return j;
                                  })();
                                  return (
                                    <tr key={map.rows[rIdx]}>
                                      <td className={`px-1.5 py-1 font-semibold text-gray-700 ${inZone ? 'bg-blue-50 border border-blue-100' : ''}`}>
                                        <div className="flex items-center space-x-1">
                                          {isStart ? (
                                            <div className="flex flex-col items-start space-y-0.5">
                                              <span className="text-[10px] px-2 py-1 rounded bg-blue-100 border border-blue-300 text-blue-800">
                                                {rowZone}
                                              </span>
                                              <span className="text-[10px] text-blue-700">
                                                Rows {map.rows[zoneStartIdx]}-{map.rows[zoneEndIdx]}
                                              </span>
                                            </div>
                                          ) : null}
                                          <input
                                            value={map.rows[rIdx]}
                                            onChange={(e) => updateRowLabel(cabin.id, rIdx, e.target.value)}
                                            className="w-10 px-1 py-0.5 border border-gray-200 rounded text-center text-[11px]"
                                          />
                                          <button
                                            onClick={() => assignRowZone(cabin.id, rIdx, zoneName || '')}
                                            className="px-1.5 py-0.5 text-[10px] border border-dashed border-gray-400 rounded hover:bg-gray-100"
                                            title="Assign current Zone name to this row"
                                          >
                                            Set Zone
                                          </button>
                                        </div>
                                      </td>
                                      {row.map((cell, cIdx) => {
                                        const seatStyle =
                                          cell.type === 'seat'
                                            ? cabinColorStyles[cell.cabin] || cabinColorStyles.Default
                                            : cabinColorStyles.Blocked;
                                        return (
                                          <td key={`${rIdx}-${cIdx}`} className="px-0.5 py-0.5">
                                            <button
                                              onClick={() => applyToolToCell(cabin.id, rIdx, cIdx)}
                                              style={seatStyle}
                                              className={`${seatSizeClass(cell.cabin)} border rounded ${
                                                cell.type === 'seat' ? colorClass : 'bg-gray-300 border-gray-400 text-gray-700'
                                              } flex flex-col items-center justify-center space-y-0.5 shadow`}
                                              title={`${cell.row}${cell.col} (${cell.cabin})${cell.zone ? ` | Zone: ${cell.zone}` : ''}`}
                                            >
                                              {cell.type === 'seat' ? (
                                                <>
                                                  <div className="flex flex-wrap justify-center gap-0.5 max-w-[36px]">
                                                    {cell.tags?.map((t) => tagBadge(t))}
                                                  </div>
                                                </>
                                              ) : (
                                                <Minus className="w-3 h-3 text-gray-600" />
                                              )}
                                            </button>
                                          </td>
                                        );
                                      })}
                                    </tr>
                                  );
                                })}
                              </tbody>
                            </table>
                          );
                        })()}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CreateSeatmap;




