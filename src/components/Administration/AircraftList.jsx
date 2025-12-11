import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Plane,
  Search,
  Filter,
  PlusCircle,
  Pencil,
  Eye,
  Copy,
  Trash2,
  Settings,
  Rows3,
} from 'lucide-react';

const summaryCards = [
  { label: 'Total Aircraft', value: 42, color: 'text-gray-900', badge: 'bg-gray-100 text-gray-700' },
  { label: 'Active', value: 30, color: 'text-green-700', badge: 'bg-green-100 text-green-700' },
  { label: 'In Maintenance', value: 8, color: 'text-orange-700', badge: 'bg-orange-100 text-orange-700' },
  { label: 'AOG', value: 4, color: 'text-red-700', badge: 'bg-red-100 text-red-700' },
];

const storageKey = 'dcs_aircraft_data';

const defaultAircraftData = [
  {
    id: 'aircraft-1',
    type: 'Boeing 777',
    registration: 'S2-AAA',
    config: 'First: 02 / Business: 16 / Economy: 42',
    status: 'Active',
    seatmap: {
      summary: 'S2-AAA (Boeing 777)',
      cabins: ['First', 'Business', 'Economy'],
    },
  },
  {
    id: 'aircraft-2',
    type: 'Airbus A320',
    registration: 'S2-AAB',
    config: 'Economy: 144 / Premium: 30',
    status: 'Inactive',
    seatmap: {
      summary: 'S2-AAB (Airbus A320)',
      cabins: ['Premium', 'Economy'],
    },
  },
  {
    id: 'aircraft-3',
    type: 'ATR 72-600',
    registration: 'S2-AAI',
    config: 'Economy: 72',
    status: 'Active',
    seatmap: {
      summary: 'S2-AAI (ATR 72-600)',
      cabins: ['Economy'],
    },
  },
  {
    id: 'aircraft-4',
    type: 'Boeing 777',
    registration: 'S2-AAH',
    config: 'Economy: 144 / Business: 30 / First: 10',
    status: 'Active',
    seatmap: {
      summary: 'S2-AAH (Boeing 777)',
      cabins: ['First', 'Business', 'Economy'],
    },
  },
  {
    id: 'aircraft-5',
    type: 'Airbus A320',
    registration: 'S2-AAE',
    config: 'Economy: 144 / Business: 30',
    status: 'Active',
    seatmap: {
      summary: 'S2-AAE (Airbus A320)',
      cabins: ['Business', 'Economy'],
    },
  },
];

const normalizeAircraft = (list) =>
  list.map((item, idx) => ({
    id: item.id || `aircraft-${idx + 1}-${item.registration || Date.now()}`,
    status: item.status || 'Active',
    config: item.config || 'Economy: 144',
    seatmap: item.seatmap || {
      summary: `${item.registration || item.type}`,
      cabins: ['Economy', 'Business'],
    },
    ...item,
  }));

const statusClass = (status) => {
  if (status === 'Active') return 'text-green-600';
  if (status === 'Inactive') return 'text-red-600';
  return 'text-gray-700';
};

const SeatmapPreview = ({ seatmap, visible }) => {
  if (!visible) return null;
  const cabins = seatmap?.cabins || [];
  const labels = cabins.map((c) => (typeof c === 'string' ? c : c.name));
  const displayCabins = labels.length ? labels : ['Cabin'];
  return (
    <div className="absolute z-20 top-full left-0 mt-2 w-[480px] bg-white border border-gray-200 rounded-lg shadow-xl p-4">
      <p className="text-sm font-semibold text-gray-900 mb-2">{seatmap.summary || 'Seatmap Preview'}</p>
      <div className="grid grid-cols-3 gap-2">
        {displayCabins.map((cabin, idx) => (
          <div key={cabin + idx} className="border border-gray-200 rounded-md overflow-hidden bg-gray-50">
            <div className="px-2 py-1 bg-[#003366] text-white text-xs font-semibold">
              {cabin}
            </div>
            <div className="p-3 grid grid-cols-4 gap-1">
              {Array.from({ length: 12 }, (_, seatIdx) => (
                <div
                  key={seatIdx}
                  className="h-5 rounded bg-white border border-gray-200 shadow-sm"
                  title={`${cabin} ${seatIdx + 1}`}
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const AircraftList = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [showConfiguredOnly, setShowConfiguredOnly] = useState(true);
  const [hoveredReg, setHoveredReg] = useState(null);
  const [aircraftData, setAircraftData] = useState(defaultAircraftData);
  const navigate = useNavigate();

  useEffect(() => {
    const stored = localStorage.getItem(storageKey);
    if (stored) {
      setAircraftData(normalizeAircraft(JSON.parse(stored)));
    } else {
      localStorage.setItem(storageKey, JSON.stringify(defaultAircraftData));
    }
  }, []);

  useEffect(() => {
    if (aircraftData) {
      localStorage.setItem(storageKey, JSON.stringify(aircraftData));
    }
  }, [aircraftData]);

  const filteredAircraft = useMemo(() => {
    return aircraftData.filter((a) => {
      const matchesSearch =
        !searchTerm ||
        a.registration.toLowerCase().includes(searchTerm.toLowerCase()) ||
        a.type.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === 'All' ? true : a.status === statusFilter;
      const matchesConfigured = showConfiguredOnly ? !!a.seatmap : true;
      return matchesSearch && matchesStatus && matchesConfigured;
    });
  }, [aircraftData, searchTerm, statusFilter, showConfiguredOnly]);

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-500">Fleet Management</p>
          <h1 className="text-2xl font-semibold text-gray-800">Aircraft List</h1>
        </div>
        <div className="flex items-center space-x-3">
          <button
            className="flex items-center space-x-2 bg-[#003366] text-white px-4 py-2 rounded-lg hover:bg-[#004080] transition"
            onClick={() => navigate('/admin/aircraft/new')}
          >
            <PlusCircle className="w-4 h-4" />
            <span className="text-sm font-semibold">Create New Aircraft</span>
          </button>
          <button className="flex items-center space-x-2 text-[#003366] border border-blue-200 px-3 py-2 rounded-lg hover:bg-blue-50">
            <Settings className="w-4 h-4" />
            <span className="text-sm font-semibold">Settings</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-4">
        {summaryCards.map((card) => (
          <div
            key={card.label}
            className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm flex items-center justify-between"
          >
            <div>
              <p className="text-xs font-semibold text-gray-500 uppercase">{card.label}</p>
              <p className={`text-3xl font-bold ${card.color}`}>{card.value}</p>
            </div>
            <span className={`px-3 py-1 text-xs font-semibold rounded-full ${card.badge}`}>{card.label}</span>
          </div>
        ))}
      </div>

      <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm space-y-4">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex-1 min-w-[260px] relative">
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-3.5" />
            <input
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by registration, airline, type..."
              className="w-full pl-9 pr-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="flex items-center space-x-2">
            <Filter className="w-4 h-4 text-gray-500" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 border border-gray-200 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="All">Filter by Status</option>
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
          </div>
          <label className="flex items-center space-x-2 text-sm text-gray-700">
            <span>Show Only Configured Aircraft</span>
            <button
              type="button"
              onClick={() => setShowConfiguredOnly((prev) => !prev)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition ${
                showConfiguredOnly ? 'bg-[#003366]' : 'bg-gray-300'
              }`}
            >
              <span
                className={`inline-block h-5 w-5 transform rounded-full bg-white transition ${
                  showConfiguredOnly ? 'translate-x-5' : 'translate-x-1'
                }`}
              />
            </button>
          </label>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 text-gray-700 border-b border-gray-200">
                <th className="text-left px-4 py-3 font-semibold">Aircraft Type</th>
                <th className="text-left px-4 py-3 font-semibold">Registration</th>
                <th className="text-left px-4 py-3 font-semibold">Configuration</th>
                <th className="text-left px-4 py-3 font-semibold">Status</th>
                <th className="text-left px-4 py-3 font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredAircraft.map((aircraft) => (
                <tr key={aircraft.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="px-4 py-3 text-gray-900 font-semibold">{aircraft.type}</td>
                  <td className="px-4 py-3 text-gray-700">{aircraft.registration}</td>
                  <td className="px-4 py-3 text-gray-700">
                    <div className="flex items-center space-x-3">
                      <div
                        className="relative"
                        onMouseEnter={() => setHoveredReg(aircraft.registration)}
                        onMouseLeave={() => setHoveredReg(null)}
                      >
                        <div className="w-9 h-9 rounded-lg bg-blue-50 text-[#003366] flex items-center justify-center border border-blue-200 cursor-pointer">
                          <Plane className="w-5 h-5" />
                        </div>
                        <SeatmapPreview
                          seatmap={aircraft.seatmap}
                          visible={hoveredReg === aircraft.registration}
                        />
                      </div>
                      <span>{aircraft.config}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`font-semibold ${statusClass(aircraft.status)}`}>{aircraft.status}</span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center space-x-3 text-gray-500">
                      <Eye
                        className="w-4 h-4 cursor-pointer hover:text-[#003366]"
                        title="View"
                        onClick={() => navigate(`/admin/aircraft/${aircraft.id}`)}
                      />
                      <Pencil
                        className="w-4 h-4 cursor-pointer hover:text-[#003366]"
                        title="Edit"
                        onClick={() => navigate(`/admin/aircraft/${aircraft.id}`)}
                      />
                      <Rows3
                        className="w-4 h-4 cursor-pointer hover:text-[#003366]"
                        title="Seatmap"
                        onClick={() => navigate(`/admin/seatmap/${aircraft.id}`)}
                      />
                      <Copy
                        className="w-4 h-4 cursor-pointer hover:text-[#003366]"
                        title="Duplicate"
                        onClick={() => {
                          const clone = normalizeAircraft([
                            ...aircraftData,
                            {
                              ...aircraft,
                              id: `aircraft-${Date.now()}`,
                              registration: `${aircraft.registration}-COPY`,
                            },
                          ]);
                          setAircraftData(clone);
                        }}
                      />
                      <Trash2
                        className="w-4 h-4 cursor-pointer hover:text-red-600"
                        title="Delete"
                        onClick={() => {
                          const next = aircraftData.filter((a) => a.id !== aircraft.id);
                          setAircraftData(next);
                        }}
                      />
                    </div>
                  </td>
                </tr>
              ))}
              {filteredAircraft.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-4 py-6 text-center text-gray-500">
                    No aircraft match the current filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AircraftList;
