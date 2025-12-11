import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Search, PlusCircle, Trash2, Save, XCircle } from 'lucide-react';

const storageKey = 'dcs_aircraft_data';

const ensureId = (list) =>
  list.map((item, idx) => ({
    id: item.id || `aircraft-${idx + 1}-${item.registration || Date.now()}`,
    ...item,
  }));

const CreateAircraft = () => {
  const navigate = useNavigate();
  const params = useParams();
  const [aircraftList, setAircraftList] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [search, setSearch] = useState('');
  const [form, setForm] = useState({
    type: '',
    icao: '',
    manufacturer: '',
    registration: '',
    config: '',
    status: 'Active',
  });

  useEffect(() => {
    const stored = localStorage.getItem(storageKey);
    if (stored) {
      const parsed = ensureId(JSON.parse(stored));
      setAircraftList(parsed);
      if (params.id === 'new') {
        setSelectedId(null);
        setForm({
          type: '',
          icao: '',
          manufacturer: '',
          registration: '',
          config: '',
          status: 'Active',
        });
      } else if (params.id && params.id !== 'new') {
        const target = parsed.find((a) => a.id === params.id);
        setSelectedId(target ? target.id : parsed[0]?.id || null);
      } else if (parsed.length) {
        setSelectedId(parsed[0].id);
      }
      localStorage.setItem(storageKey, JSON.stringify(parsed));
    }
  }, [params.id]);

  useEffect(() => {
    if (!selectedId || !aircraftList.length) return;
    const current = aircraftList.find((a) => a.id === selectedId);
    if (current) {
      setForm({
        type: current.type || '',
        icao: current.icao || '',
        manufacturer: current.manufacturer || '',
        registration: current.registration || '',
        config: current.config || '',
        status: current.status || 'Active',
      });
    }
  }, [selectedId, aircraftList]);

  useEffect(() => {
    localStorage.setItem(storageKey, JSON.stringify(aircraftList));
  }, [aircraftList]);

  const filteredList = useMemo(() => {
    const term = search.trim().toLowerCase();
    if (!term) return aircraftList;
    return aircraftList.filter(
      (a) =>
        a.type.toLowerCase().includes(term) ||
        (a.registration || '').toLowerCase().includes(term) ||
        (a.icao || '').toLowerCase().includes(term)
    );
  }, [aircraftList, search]);

  const startNew = () => {
    setSelectedId(null);
    setForm({
      type: '',
      icao: '',
      manufacturer: '',
      registration: '',
      config: '',
      status: 'Active',
    });
  };

  const handleSave = () => {
    if (!form.type || !form.registration) {
      alert('Type name and registration are required.');
      return;
    }
    const newId = selectedId || `aircraft-${Date.now()}`;
    const payload = {
      ...form,
      id: newId,
      seatmap: {
        summary: `${form.registration || form.type}`,
        cabins: ['Economy', 'Business'],
      },
    };
    setAircraftList((prev) => {
      const exists = prev.find((a) => a.id === payload.id);
      if (exists) {
        return prev.map((a) => (a.id === payload.id ? payload : a));
      }
      return [...prev, payload];
    });
    setSelectedId(newId);
  };

  const handleDelete = () => {
    if (!selectedId) return;
    setAircraftList((prev) => {
      const next = prev.filter((a) => a.id !== selectedId);
      if (next.length) {
        setSelectedId(next[0].id);
      } else {
        startNew();
      }
      return next;
    });
  };

  const handleCancel = () => {
    if (selectedId) {
      const current = aircraftList.find((a) => a.id === selectedId);
      if (current) {
        setForm({
          type: current.type || '',
          icao: current.icao || '',
          manufacturer: current.manufacturer || '',
          registration: current.registration || '',
          config: current.config || '',
          status: current.status || 'Active',
        });
      }
    } else {
      startNew();
    }
  };

  return (
    <div className="p-6 space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-500">Fleet Management</p>
          <h1 className="text-2xl font-semibold text-gray-800">Create / Edit Aircraft</h1>
        </div>
        <button
          onClick={() => navigate('/admin/aircraft')}
          className="text-sm font-semibold text-[#003366] border border-blue-200 px-3 py-2 rounded-lg hover:bg-blue-50"
        >
          Back to List
        </button>
      </div>

      <div className="bg-white border border-gray-200 rounded-lg shadow-sm grid grid-cols-3">
        <div className="border-r border-gray-200 p-4 space-y-4">
          <div className="relative">
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-3.5" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search..."
              className="w-full pl-9 pr-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="text-xs text-gray-500 font-semibold uppercase">Sort by: Type Name</div>
          <div className="max-h-[420px] overflow-y-auto divide-y divide-gray-100 border border-gray-100 rounded-lg">
            {filteredList.map((item) => (
              <div
                key={item.id}
                onClick={() => setSelectedId(item.id)}
                className={`px-4 py-3 cursor-pointer hover:bg-gray-50 ${
                  selectedId === item.id ? 'bg-blue-50 border-l-4 border-[#003366]' : ''
                }`}
              >
                <p className="text-sm font-semibold text-gray-900">{item.type}</p>
                <p className="text-xs text-gray-600">{item.registration}</p>
              </div>
            ))}
            {filteredList.length === 0 && (
              <div className="px-4 py-6 text-center text-sm text-gray-500">No aircraft found.</div>
            )}
          </div>
          <button
            onClick={startNew}
            className="w-full flex items-center justify-center space-x-2 bg-[#003366] text-white px-4 py-2 rounded-lg hover:bg-[#004080] transition"
          >
            <PlusCircle className="w-4 h-4" />
            <span className="text-sm font-semibold">Add Aircraft</span>
          </button>
        </div>

        <div className="col-span-2 p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">{form.type || 'New Aircraft'}</h2>
          <div className="border border-gray-200 rounded-lg p-4 shadow-sm">
            <p className="text-sm font-semibold text-gray-700 mb-3">Basic Information</p>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Type Name</label>
                <input
                  value={form.type}
                  onChange={(e) => setForm((f) => ({ ...f, type: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g., Airbus A320"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">ICAO Code</label>
                <input
                  value={form.icao}
                  onChange={(e) => setForm((f) => ({ ...f, icao: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g., A320"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Manufacturer</label>
                <input
                  value={form.manufacturer}
                  onChange={(e) => setForm((f) => ({ ...f, manufacturer: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g., Airbus"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Registration</label>
                <input
                  value={form.registration}
                  onChange={(e) => setForm((f) => ({ ...f, registration: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g., S2-AAA"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Configuration</label>
                <input
                  value={form.config}
                  onChange={(e) => setForm((f) => ({ ...f, config: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g., Economy: 144 / Business: 30"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Status</label>
                <select
                  value={form.status}
                  onChange={(e) => setForm((f) => ({ ...f, status: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-3 mt-6">
            <button
              onClick={handleSave}
              className="inline-flex items-center space-x-2 bg-[#003366] text-white px-4 py-2 rounded-lg hover:bg-[#004080] transition"
            >
              <Save className="w-4 h-4" />
              <span className="text-sm font-semibold">Save Changes</span>
            </button>
            <button
              onClick={handleCancel}
              className="inline-flex items-center space-x-2 text-gray-700 border border-gray-300 px-4 py-2 rounded-lg hover:bg-gray-100"
            >
              <XCircle className="w-4 h-4" />
              <span className="text-sm font-semibold">Cancel</span>
            </button>
            <button
              onClick={handleDelete}
              disabled={!selectedId}
              className="inline-flex items-center space-x-2 text-white bg-red-600 px-4 py-2 rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Trash2 className="w-4 h-4" />
              <span className="text-sm font-semibold">Delete</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateAircraft;
