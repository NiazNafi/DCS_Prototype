import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Save, XCircle } from 'lucide-react';

const storageKey = 'dcs_aircraft_data';

const defaultAircraftData = [
  { id: 'aircraft-1', type: 'Boeing 777', registration: 'S2-AAA', config: 'First: 02 / Business: 16 / Economy: 42', status: 'Active' },
  { id: 'aircraft-2', type: 'Airbus A320', registration: 'S2-AAB', config: 'Economy: 144 / Premium: 30', status: 'Inactive' },
  { id: 'aircraft-3', type: 'ATR 72-600', registration: 'S2-AAI', config: 'Economy: 72', status: 'Active' },
];

const CABIN_TYPES = ['First', 'Business', 'Premium', 'Economy'];

const normalizeAircraft = (list) =>
  list.map((item, idx) => ({
    id: item.id || `aircraft-${idx + 1}-${item.registration || Date.now()}`,
    status: item.status || 'Active',
    config: item.config || 'Economy: 144',
    seatmap: item.seatmap,
    ...item,
  }));

const ensureSeatmap = (aircraft) => {
  if (aircraft?.seatmap?.cabins) return aircraft.seatmap;
  return { cabins: [], cabinMaps: {} };
};

const CreateCabin = () => {
  const navigate = useNavigate();
  const [aircraftList, setAircraftList] = useState([]);
  const [selectedId, setSelectedId] = useState('');
  const [cabinType, setCabinType] = useState(CABIN_TYPES[0]);
  const [cabinCode, setCabinCode] = useState('');
  const [isActive, setIsActive] = useState(true);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const stored = localStorage.getItem(storageKey);
    if (stored) {
      const parsed = normalizeAircraft(JSON.parse(stored));
      if (parsed.length) {
        setAircraftList(parsed);
        if (!selectedId) setSelectedId(parsed[0].id);
        return;
      }
    }
    // Fallback to bundled dummy aircraft and persist so dropdown is never empty
    setAircraftList(defaultAircraftData);
    localStorage.setItem(storageKey, JSON.stringify(defaultAircraftData));
    if (!selectedId && defaultAircraftData.length) {
      setSelectedId(defaultAircraftData[0].id);
    }
  }, []);

  const selectedAircraft = useMemo(() => aircraftList.find((a) => a.id === selectedId), [aircraftList, selectedId]);

  const handleCreate = () => {
    if (!selectedId) {
      setMessage('Please select an aircraft');
      return;
    }
    const code = cabinCode.trim() || `${cabinType.charAt(0)}${Math.floor(Math.random() * 9) + 1}`;
    const updated = aircraftList.map((a) => {
      if (a.id !== selectedId) return a;
      const existingSeatmap = ensureSeatmap(a);
      const newCabin = {
        id: `cabin-${Date.now()}`,
        name: cabinType,
        code,
        active: isActive,
        deck: 1,
        startRow: '',
        endRow: '',
        startCol: '',
        endCol: '',
        layout: '3-3',
      };
      return {
        ...a,
        seatmap: {
          ...existingSeatmap,
          cabins: [...(existingSeatmap.cabins || []), newCabin],
        },
      };
    });
    setAircraftList(updated);
    localStorage.setItem(storageKey, JSON.stringify(updated));
    setMessage('Cabin created and linked to aircraft.');
    setTimeout(() => setMessage(''), 2000);
    setCabinCode('');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 p-8">
      <div className="max-w-5xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-slate-500">Cabin Management</p>
            <h1 className="text-2xl font-semibold text-slate-900">Create Aircraft Cabin</h1>
            <p className="text-sm text-slate-600">Add details to configure a new aircraft cabin. Linked cabins appear in seatmap creation.</p>
            {message && <p className="mt-1 text-sm text-green-600">{message}</p>}
          </div>
        </div>

        <div className="bg-white/90 backdrop-blur border border-slate-200 rounded-xl shadow-lg p-6 space-y-5">
          <h2 className="text-sm font-semibold text-slate-900">Cabin Information</h2>

          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Aircraft</label>
              <select
                value={selectedId}
                onChange={(e) => setSelectedId(e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select aircraft</option>
                {aircraftList.map((a) => (
                  <option key={a.id} value={a.id}>
                    {a.type} - {a.registration}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Cabin Type</label>
              <select
                value={cabinType}
                onChange={(e) => setCabinType(e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {CABIN_TYPES.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Cabin Code</label>
              <input
                value={cabinCode}
                onChange={(e) => setCabinCode(e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="e.g., C1"
              />
            </div>

            <div className="col-span-2">
              <label className="inline-flex items-center text-sm text-slate-700 space-x-2">
                <input
                  type="checkbox"
                  checked={isActive}
                  onChange={(e) => setIsActive(e.target.checked)}
                  className="h-4 w-4 text-[#003366] border-slate-300 rounded"
                />
                <span>Is Active</span>
              </label>
            </div>
          </div>

          <div className="flex items-center justify-end space-x-3 pt-2">
            <button
              onClick={() => navigate('/admin')}
              className="inline-flex items-center space-x-2 text-slate-700 border border-slate-200 px-4 py-2 rounded-lg hover:bg-slate-50"
            >
              <XCircle className="w-4 h-4" />
              <span className="text-sm font-semibold">Cancel</span>
            </button>
            <button
              onClick={handleCreate}
              className="inline-flex items-center space-x-2 bg-[#003366] text-white px-4 py-2 rounded-lg hover:bg-[#004080] transition"
            >
              <Save className="w-4 h-4" />
              <span className="text-sm font-semibold">Create Cabin</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateCabin;
