import { useMemo, useState } from 'react';
import {
  BadgeCheck,
  ChevronDown,
  HelpCircle,
  Info,
  Printer,
  RefreshCcw,
  Search,
} from 'lucide-react';

const seatColors = {
  available: 'bg-blue-50 text-blue-700 border-blue-200',
  checkedIn: 'bg-emerald-100 text-emerald-700 border-emerald-200',
  boarded: 'bg-blue-600 text-white border-blue-700',
  blocked: 'bg-gray-200 text-gray-500 border-gray-300',
};

const seatLayout = [
  { row: 1, seats: ['available', 'checkedIn', 'available', 'available', 'available', 'boarded'] },
  { row: 2, seats: ['available', 'available', 'available', 'available', 'available', 'available'] },
  { row: 3, seats: ['boarded', 'available', 'checkedIn', 'available', 'available', 'boarded'] },
  { row: 4, seats: ['available', 'available', 'available', 'available', 'available', 'available'] },
  { row: 5, seats: ['available', 'available', 'available', 'available', 'boarded', 'available'] },
  { row: 6, seats: ['available', 'available', 'boarded', 'available', 'available', 'blocked'] },
  { row: 7, seats: ['boarded', 'boarded', 'available', 'available', 'available', 'available'] },
  { row: 8, seats: ['available', 'boarded', 'available', 'available', 'available', 'available'] },
];

const FlightSummaryView = () => {
  const [includeToggle, setIncludeToggle] = useState(true);

  const passengerSummary = useMemo(
    () => ({
      total: 150,
      checkedIn: 140,
      boarded: 130,
      noShow: 10,
    }),
    []
  );

  const baggage = useMemo(
    () => ({
      totalBags: 180,
      totalWeight: 2500,
    }),
    []
  );

  const passengerDetails = useMemo(
    () => [
      { category: 'Adult', male: 70, female: 60, total: 130 },
      { category: 'Child', male: 6, female: 8, total: 14 },
      { category: 'Infant', male: 1, female: 1, total: 2 },
    ],
    []
  );

  const crewOps = useMemo(
    () => ({
      mos: 5,
      dhc: 2,
      fso: 1,
      exst: 0,
    }),
    []
  );

  const selectedPassenger = {
    name: 'John Doe',
    seat: '2B',
    baggage: 2,
    checkedIn: true,
    boarded: true,
  };

  const statusChip = (text, tone = 'green') => {
    const tones = {
      green: 'bg-emerald-100 text-emerald-700',
      blue: 'bg-blue-100 text-blue-700',
      gray: 'bg-gray-100 text-gray-700',
    };
    return (
      <span className={`px-2 py-1 rounded text-xs font-semibold ${tones[tone] || tones.gray}`}>
        {text}
      </span>
    );
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-3 space-y-3">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-gray-200 pb-2">
        <div className="flex items-center gap-3">
          <div className="text-lg font-bold text-gray-900">FL1234</div>
          <div className="text-gray-700 font-semibold">JFK → LAX</div>
          <div className="text-xs text-gray-500">B737</div>
        </div>
        <div className="flex flex-wrap items-center gap-2 text-[11px] font-semibold text-gray-700">
          <div>ETD <span className="text-gray-900">10:00 AM</span></div>
          <div>BTD <span className="text-gray-900">09:30 AM</span></div>
          <div>Gate <span className="text-gray-900">A12</span></div>
          <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700">On Time</span>
        </div>
        <div className="flex items-center gap-1 text-gray-500">
          <button className="p-1 rounded-full hover:bg-gray-100"><RefreshCcw className="w-4 h-4" /></button>
          <button className="p-1 rounded-full hover:bg-gray-100"><Printer className="w-4 h-4" /></button>
          <button className="p-1 rounded-full hover:bg-gray-100"><Info className="w-4 h-4" /></button>
          <button className="p-1 rounded-full hover:bg-gray-100"><HelpCircle className="w-4 h-4" /></button>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-3 items-start">
        {/* Summary stack */}
        <div className="space-y-2">
          <div className="border border-gray-200 rounded-md p-2.5">
            <h3 className="text-xs font-semibold text-gray-800 mb-1">Passenger Summary</h3>
            <div className="grid grid-cols-2 gap-y-0.5 text-xs text-gray-700">
              <p>Total Pax: <span className="font-semibold">{passengerSummary.total}</span></p>
              <p>Checked-in: <span className="font-semibold">{passengerSummary.checkedIn}</span></p>
              <p>Boarded: <span className="font-semibold">{passengerSummary.boarded}</span></p>
              <p>No-Show: <span className="font-semibold text-red-600">{passengerSummary.noShow}</span></p>
            </div>
          </div>

          <div className="border border-gray-200 rounded-md p-2.5">
            <h3 className="text-xs font-semibold text-gray-800 mb-1">Weight &amp; Baggage</h3>
            <div className="text-xs text-gray-700 space-y-0.5">
              <p>Total Bags: <span className="font-semibold">{baggage.totalBags}</span></p>
              <p>Total Weight: <span className="font-semibold">{baggage.totalWeight} kg</span></p>
            </div>
            <div className="mt-1.5 flex items-center justify-between text-xs text-gray-700">
              <span>Include</span>
              <button
                role="switch"
                aria-checked={includeToggle}
                onClick={() => setIncludeToggle((v) => !v)}
                className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${
                  includeToggle ? 'bg-[#003366]' : 'bg-gray-300'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    includeToggle ? 'translate-x-4' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
          </div>

          <div className="border border-gray-200 rounded-md p-2.5">
            <h3 className="text-xs font-semibold text-gray-800 mb-1">Crew / Ops</h3>
            <div className="grid grid-cols-2 gap-y-0.5 text-xs text-gray-700">
              <p>MOS: <span className="font-semibold">{crewOps.mos}</span></p>
              <p>DHC: <span className="font-semibold">{crewOps.dhc}</span></p>
              <p>FSO: <span className="font-semibold">{crewOps.fso}</span></p>
              <p>EXST: <span className="font-semibold">{crewOps.exst}</span></p>
            </div>
          </div>

          <div className="border border-gray-200 rounded-md p-2.5">
            <h3 className="text-xs font-semibold text-gray-800 mb-1">Passenger Details</h3>
            <div className="space-y-0.5 text-xs text-gray-700">
              {passengerDetails.map((item) => (
                <div key={item.category} className="flex items-center justify-between">
                  <span className="font-medium w-20">{item.category}</span>
                  <span className="text-center w-10">{item.male}</span>
                  <span className="text-center w-10">{item.female}</span>
                  <span className="text-center w-10 font-semibold">{item.total}</span>
                </div>
              ))}
              <div className="pt-1 border-t border-gray-100 space-y-0.5">
                <p>No-Show: <span className="font-semibold text-red-600">{passengerSummary.noShow}</span></p>
                <p>Boarded: <span className="font-semibold text-blue-700">{passengerSummary.boarded}</span></p>
                <p>Baggage: <span className="font-semibold">{baggage.totalBags}</span></p>
              </div>
            </div>
          </div>
        </div>

        {/* Seat map and quick actions */}
        <div className="border border-gray-200 rounded-md p-3 flex flex-col gap-2.5">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-gray-800">Aircraft Outline</h3>
            <div className="text-xs text-gray-500">Top / Bottom</div>
          </div>

          <div className="relative border border-gray-100 rounded-md p-2 bg-gray-50">
            <div className="grid grid-cols-7 gap-1 text-[10px] font-semibold text-gray-500 mb-1 px-1">
              <span />
              {['A', 'B', 'C', 'D', 'E', 'F'].map((l) => (
                <span key={l} className="text-center">
                  {l}
                </span>
              ))}
            </div>
            <div className="space-y-0.5">
              {seatLayout.map((row) => (
                <div key={row.row} className="grid grid-cols-7 gap-1 items-center px-1">
                  <div className="text-center text-[11px] font-semibold text-gray-700">{row.row}</div>
                  {row.seats.map((status, idx) => (
                    <div
                      key={`${row.row}-${idx}`}
                      className={`w-7 h-7 flex items-center justify-center rounded border text-[10px] font-bold ${seatColors[status]}`}
                    >
                      {row.row}
                      {String.fromCharCode(65 + idx)}
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <button className="flex items-center justify-center gap-1.5 bg-[#003366] text-white text-xs font-semibold py-2 rounded-lg hover:bg-[#004080]">
              Check-in
            </button>
            <button className="flex items-center justify-center gap-1.5 bg-gray-100 text-gray-700 text-xs font-semibold py-2 rounded-lg border border-gray-200 hover:bg-gray-200">
              Auto Check-in
            </button>
            <button className="py-2 text-[11px] font-semibold bg-white border border-gray-200 rounded-lg hover:bg-gray-50">
              PCS
            </button>
            <button className="py-2 text-[11px] font-semibold bg-white border border-gray-200 rounded-lg hover:bg-gray-50">
              KG
            </button>
          </div>

          <div className="relative">
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-2.5 pointer-events-none" />
            <input
              placeholder="Search passenger, seat, or PNR"
              className="w-full pl-8 pr-8 py-2 border border-gray-200 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-[#003366]/40"
            />
            <ChevronDown className="w-4 h-4 text-gray-400 absolute right-2.5 top-2.5" />
          </div>
        </div>

        {/* Passenger details panel */}
        <div className="border border-gray-200 rounded-md p-3 flex flex-col gap-2.5">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-gray-800">Passenger Details</h3>
            <BadgeCheck className="w-5 h-5 text-gray-400" />
          </div>
          <div className="flex items-center gap-2.5">
            <div className="w-11 h-11 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 font-bold">
              JD
            </div>
            <div>
              <p className="text-[11px] text-gray-500">Passenger Name</p>
              <p className="text-sm font-bold text-gray-900">{selectedPassenger.name}</p>
              <p className="text-xs text-gray-600">
                Seat: <span className="font-semibold">{selectedPassenger.seat}</span>
              </p>
            </div>
          </div>
          <div className="flex gap-1.5">
            {selectedPassenger.checkedIn && statusChip('Checked-in', 'blue')}
            {selectedPassenger.boarded && statusChip('Boarded', 'green')}
          </div>
          <p className="text-xs text-gray-700">
            Baggage: <span className="font-semibold">{selectedPassenger.baggage} items</span>
          </p>
          <div className="space-y-1.5">
            <button className="w-full bg-gray-100 text-gray-800 text-xs font-semibold py-2 rounded-lg border border-gray-200 hover:bg-gray-200">
              Reassign Seat
            </button>
            <button className="w-full bg-blue-100 text-blue-800 text-xs font-semibold py-2 rounded-lg border border-blue-200 hover:bg-blue-200">
              Add Baggage
            </button>
            <button className="w-full bg-red-500 text-white text-xs font-semibold py-2 rounded-lg hover:bg-red-600">
              Mark as No-Show
            </button>
          </div>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between text-[11px] text-gray-500 pt-1.5 border-t border-gray-200">
        <p>Last updated: 2023-10-27 10:30 AM</p>
        <button className="text-[#003366] font-semibold hover:underline">Flight Operations Dashboard</button>
      </div>
    </div>
  );
};

export default FlightSummaryView;
