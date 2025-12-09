import { useMemo, useState } from 'react';
import { Calendar, RefreshCw, Search, X } from 'lucide-react';

const Dashboard = () => {
  const [showVipModal, setShowVipModal] = useState(false);
  const [vipSearch, setVipSearch] = useState('');

  const [showNoShowModal, setShowNoShowModal] = useState(false);
  const [noShowSearch, setNoShowSearch] = useState('');
  const [noShowType, setNoShowType] = useState('All');
  const [noShowStatus, setNoShowStatus] = useState('NO SHOW');

  const stats = [
    { label: 'Flights Today', value: '47', subtitle: '12 Departures / 35 Arrivals' },
    { label: 'Active Check-in', value: '3', subtitle: 'Open counters' },
    { label: 'VIP / CIP', value: '184', subtitle: '48 waiting', action: () => setShowVipModal(true) },
    { label: 'Wheelchair', value: '8', subtitle: '10 not yet assisted' },
    { label: 'Delayed Flights', value: '5', subtitle: 'Avg delay 24 min' },
    { label: 'No-Show', value: '10', subtitle: 'Refunded / Re-issued', action: () => setShowNoShowModal(true) },
  ];

  const vipList = useMemo(
    () => [
      { pnr: 'B23PN', name: 'Mr. Nihad Hossain', ssr: 'VIP', flight: 'BS201', route: 'DAC-DOH' },
      { pnr: 'QTB7NP', name: 'Farhana Yasmin', ssr: 'VIP', flight: 'BS103', route: 'DAC-CGP' },
      { pnr: 'XT8FWF', name: 'Kushona Rahman', ssr: 'VIP', flight: 'BS103', route: 'DAC-CGP' },
      { pnr: 'T2RTK9', name: 'Kabir Ahmed', ssr: 'VIP', flight: 'BS117', route: 'DAC-ZYL' },
      { pnr: 'ZXJLMP', name: 'Rokeya Jahan', ssr: 'VIP', flight: 'BS505', route: 'DAC-JED' },
      { pnr: 'PM0Y7P', name: 'Shahadat Rafi', ssr: 'VIP', flight: 'BS505', route: 'DAC-DOH' },
      { pnr: 'HNXK9P', name: 'Tonmoy Hasan', ssr: 'VIP', flight: 'BS218', route: 'DAC-AUH' },
      { pnr: 'RWBPLZ', name: 'Omar Faruq Siddique', ssr: 'VIP', flight: 'BS307', route: 'DAC-HKT' },
    ],
    []
  );

  const filteredVipList = useMemo(() => {
    const term = vipSearch.trim().toLowerCase();
    if (!term) return vipList;
    return vipList.filter(
      (p) =>
        p.name.toLowerCase().includes(term) ||
        p.pnr.toLowerCase().includes(term) ||
        p.flight.toLowerCase().includes(term) ||
        p.route.toLowerCase().includes(term)
    );
  }, [vipList, vipSearch]);

  const departures = [
    { flight: 'BS101', route: 'DAC - ZED', std: '05:30', status: 'On Time', load: '436/2/436', checkin: '191/110', gate: 'D7', actions: '---' },
    { flight: 'BS103', route: 'DAC - SIN', std: '10:15', status: 'Delayed', load: '280/300', checkin: '111/150', gate: 'C08', actions: '---' },
    { flight: 'BS341', route: 'DAC - DOH', std: '10:45', status: 'On Time', load: '150/180', checkin: '130/135', gate: 'A05', actions: '---' },
    { flight: 'BS361', route: 'DAC - FRA', std: '11:30', status: 'On Time', load: '220/430', checkin: '140/145', gate: 'B12', actions: '---' },
    { flight: 'BS106', route: 'DAC - FRA', std: '11:30', status: 'On Time', load: '110/200', checkin: '150/155', gate: 'C02', actions: '---' },
  ];

  const currentFlight = {
    number: 'BG201',
    route: 'Dhaka (DAC) - London Heathrow (LHR)',
    date: '19 Nov 2025',
    checkInProgress: '100%',
    boardingProgress: '40%',
    paxProgress: '0%',
    aircraft: 'Airbus A380-900',
    registration: 'Reg: AG-GO2',
    std: 'STD 07:45',
    atd: 'ATD 08:12',
    pto: 'P/TO:8',
    status: '4912/07/487',
  };

  const noShowPassengers = useMemo(
    () => [
      { name: 'Md. Rakib Hossain', type: 'ADT', pnr: 'DR7PYV', baggage: '0/0', status: 'NO SHOW', currentStatus: 'REFUNDED', ticket: '988234567891', coupon: '988234567891' },
      { name: 'Farhana Yasmin', type: 'ADT', pnr: 'DR7PYV', baggage: '1/15', status: 'NO SHOW', currentStatus: 'REFUNDED', ticket: '988234567892', coupon: '988234567892' },
      { name: 'Tanvir Ahmed Khan', type: 'ADT', pnr: 'DR7PYV', baggage: '0/0', status: 'NO SHOW', currentStatus: 'REFUNDED', ticket: '988234567893', coupon: '988234567893' },
      { name: 'Nurjot Jahan', type: 'CHD', pnr: 'QT8BHF', baggage: '3/60', status: 'NO SHOW', currentStatus: 'RE-ISSUED', ticket: '988234567894', coupon: '988234567894' },
      { name: 'Ahsan Habib', type: 'ADT', pnr: 'QT8BHF', baggage: '1/20', status: 'NO SHOW', currentStatus: 'RE-ISSUED', ticket: '988234567895', coupon: '988234567895' },
    ],
    []
  );

  const filteredNoShow = useMemo(() => {
    const term = noShowSearch.trim().toLowerCase();
    return noShowPassengers.filter((p) => {
      const matchTerm =
        !term ||
        p.name.toLowerCase().includes(term) ||
        p.pnr.toLowerCase().includes(term) ||
        p.ticket.toLowerCase().includes(term);
      const matchType = noShowType === 'All' ? true : p.type === noShowType;
      const matchStatus = noShowStatus === 'All' ? true : p.status === noShowStatus;
      return matchTerm && matchType && matchStatus;
    });
  }, [noShowPassengers, noShowSearch, noShowType, noShowStatus]);

  return (
    <>
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold text-gray-800">Dhaka (DAC) | 19 Nov 2025</h1>
        </div>

        <div className="grid grid-cols-6 gap-4">
          {stats.map((stat, index) => (
            <button
              key={index}
              type="button"
              onClick={stat.action}
              className={`bg-white rounded-lg p-5 shadow-sm border border-gray-200 text-left w-full ${
                stat.action ? 'hover:border-blue-300 hover:shadow transition' : ''
              }`}
            >
              <p className="text-sm text-gray-600 mb-2">{stat.label}</p>
              <p className="text-3xl font-bold text-gray-900 mb-1">{stat.value}</p>
              <p className="text-xs text-gray-500">{stat.subtitle}</p>
            </button>
          ))}
        </div>

        <div className="grid grid-cols-3 gap-6">
          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Search Flight</h2>
            <input
              type="text"
              placeholder="Enter flight number (e.g. BS101)"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4"
            />

            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-medium">NOVEMBER 2025</span>
                <div className="flex space-x-1">
                  <button className="p-1 hover:bg-gray-200 rounded">&lt;</button>
                  <button className="p-1 hover:bg-gray-200 rounded">&gt;</button>
                </div>
              </div>

              <div className="grid grid-cols-7 gap-1 text-center text-xs">
                {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, i) => (
                  <div key={i} className="font-semibold text-gray-600 py-1">{day}</div>
                ))}
                {Array.from({ length: 30 }, (_, i) => (
                  <div
                    key={i}
                    className={`py-2 rounded ${
                      i + 1 === 19
                        ? 'bg-blue-600 text-white'
                        : 'hover:bg-gray-200 text-gray-700'
                    }`}
                  >
                    {i + 1}
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="col-span-2 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-6 shadow-sm border border-blue-200">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-800">
                {currentFlight.number} | {currentFlight.route} | {currentFlight.date}
              </h2>
              <RefreshCw className="w-5 h-5 text-gray-600 cursor-pointer hover:rotate-180 transition-transform" />
            </div>

            <div className="grid grid-cols-3 gap-4 mb-6">
              <div>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-xs text-gray-600">Check In</span>
                  <span className="text-xs font-semibold text-gray-900">{currentFlight.checkInProgress}</span>
                </div>
                <div className="w-full bg-gray-300 rounded-full h-2">
                  <div className="bg-green-500 h-2 rounded-full" style={{ width: currentFlight.checkInProgress }}></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-xs text-gray-600">Boarding</span>
                  <span className="text-xs font-semibold text-gray-900">{currentFlight.boardingProgress}</span>
                </div>
                <div className="w-full bg-gray-300 rounded-full h-2">
                  <div className="bg-yellow-500 h-2 rounded-full" style={{ width: currentFlight.boardingProgress }}></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-xs text-gray-600">Paxs</span>
                  <span className="text-xs font-semibold text-gray-900">{currentFlight.paxProgress}</span>
                </div>
                <div className="w-full bg-gray-300 rounded-full h-2">
                  <div className="bg-blue-500 h-2 rounded-full" style={{ width: currentFlight.paxProgress }}></div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg p-4 mb-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-gray-600 mb-2">{currentFlight.aircraft} | {currentFlight.registration} | {currentFlight.std} | {currentFlight.atd} | {currentFlight.pto} | {currentFlight.status}</p>

                  <div className="mt-4">
                    <h3 className="font-semibold text-gray-800 mb-2">Passenger Info</h3>
                    <div className="space-y-1 text-xs">
                      <p>Total PAX: <span className="font-semibold">200/196/82/32</span></p>
                      <p>VIP/CIP: <span className="font-semibold">24/18</span></p>
                    </div>
                  </div>

                  <div className="mt-4">
                    <h3 className="font-semibold text-gray-800 mb-2">Transit</h3>
                    <div className="space-y-1 text-xs">
                      <p>Inbound: <span className="font-semibold">87</span></p>
                      <p>Outbound: <span className="font-semibold">87</span></p>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold text-gray-800 mb-2">Flight Summary</h3>
                  <div className="space-y-1 text-xs">
                    <p>M/F/C/I: <span className="font-semibold">200/196/82/32</span></p>
                    <p>M/F/C/I: <span className="font-semibold">14/8/0</span></p>
                    <p>WCHR/WCHC/WCHS: <span className="font-semibold">14/8/0</span></p>
                    <p>Cabin: F <span className="font-semibold">14/14</span> J <span className="font-semibold">28/76</span> Y <span className="font-semibold">352/492</span></p>
                    <p>Baggage: <span className="font-semibold">193/ 1024</span> EST: <span className="font-semibold">152100 Kgs</span></p>
                    <p>Pax: <span className="font-semibold">194 kg</span></p>
                    <p>Checkin Off Time: <span className="font-semibold">15:40</span> Airborne: <span className="font-semibold">15:05</span></p>
                    <p>Status: <span className="font-semibold text-green-600">Early 7/0=Teen Delayed</span></p>
                  </div>
                </div>
              </div>

              <div className="mt-4">
                <p className="text-xs text-gray-600">
                  Boarded: <span className="font-semibold">487</span> No Show: <span className="font-semibold">5</span> Go Show: <span className="font-semibold">12</span>
                </p>
              </div>
            </div>

            <div className="flex space-x-3">
              <button className="flex-1 bg-[#003366] text-white py-2 px-4 rounded-lg hover:bg-[#004080] transition-colors font-medium">
                Open Check-in Desk
              </button>
              <button className="flex-1 bg-[#003366] text-white py-2 px-4 rounded-lg hover:bg-[#004080] transition-colors font-medium">
                View Passenger List
              </button>
              <button className="flex-1 bg-[#003366] text-white py-2 px-4 rounded-lg hover:bg-[#004080] transition-colors font-medium">
                Weight and Balance
              </button>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Next 10 Departures</h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Flight</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Route</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">STD</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Status</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Load</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Check-in</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Gate</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody>
                {departures.map((flight, index) => (
                  <tr key={index} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-3 px-4 text-sm font-medium text-gray-900">{flight.flight}</td>
                    <td className="py-3 px-4 text-sm text-gray-700">{flight.route}</td>
                    <td className="py-3 px-4 text-sm text-gray-700">{flight.std}</td>
                    <td className="py-3 px-4">
                      <span className={`text-sm font-medium ${
                        flight.status === 'On Time' ? 'text-green-600' : 'text-orange-600'
                      }`}>
                        {flight.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-700">{flight.load}</td>
                    <td className="py-3 px-4 text-sm text-gray-700">{flight.checkin}</td>
                    <td className="py-3 px-4 text-sm text-gray-700">{flight.gate}</td>
                    <td className="py-3 px-4 text-sm text-gray-500">{flight.actions}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {showVipModal && (
        <div className="fixed inset-0 z-40 flex items-start justify-center bg-black/40 px-4 py-8">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl border border-gray-200">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
              <div>
                <p className="text-sm text-gray-500">Tuesday, 19 Nov 2025</p>
                <h3 className="text-lg font-bold text-gray-900">SSR Overview</h3>
              </div>
              <button
                onClick={() => setShowVipModal(false)}
                className="p-2 rounded-full hover:bg-gray-100 text-gray-500"
                aria-label="Close"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="px-6 py-4 space-y-4">
              <div className="flex flex-wrap gap-3 items-end">
                <div className="flex-1 min-w-[200px] relative">
                  <label className="text-xs font-semibold text-gray-500 uppercase mb-1 block">Search</label>
                  <Search className="w-4 h-4 text-gray-400 absolute left-3 top-9 pointer-events-none" />
                  <input
                    value={vipSearch}
                    onChange={(e) => setVipSearch(e.target.value)}
                    placeholder="Search PNR, passenger name, flight, or route"
                    className="w-full pl-9 pr-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <button
                  onClick={() => setVipSearch('')}
                  className="px-4 py-2 text-sm font-semibold text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-100"
                >
                  Clear
                </button>
              </div>

              <div className="border border-gray-200 rounded-lg overflow-hidden">
                <div className="grid grid-cols-5 bg-gray-50 text-xs font-semibold text-gray-600 uppercase">
                  <div className="px-4 py-2">PNR</div>
                  <div className="px-4 py-2">Passenger Name</div>
                  <div className="px-4 py-2">SSR</div>
                  <div className="px-4 py-2">Flight Number</div>
                  <div className="px-4 py-2">Route</div>
                </div>
                <div className="max-h-80 overflow-y-auto divide-y divide-gray-100">
                  {filteredVipList.map((p, idx) => (
                    <div key={`${p.pnr}-${idx}`} className="grid grid-cols-5 text-sm text-gray-700 hover:bg-gray-50">
                      <div className="px-4 py-2 font-mono">{p.pnr}</div>
                      <div className="px-4 py-2">{p.name}</div>
                      <div className="px-4 py-2 font-semibold text-blue-700">{p.ssr}</div>
                      <div className="px-4 py-2 font-semibold text-gray-900">{p.flight}</div>
                      <div className="px-4 py-2 text-gray-600">{p.route}</div>
                    </div>
                  ))}
                  {filteredVipList.length === 0 && (
                    <div className="px-4 py-6 text-center text-sm text-gray-500">No passengers found.</div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {showNoShowModal && (
        <div className="fixed inset-0 z-40 flex items-start justify-center bg-black/40 px-4 py-8">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-5xl border border-gray-200">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
              <div>
                <p className="text-sm text-gray-500">BS201 | 19 Nov 2025</p>
                <h3 className="text-lg font-bold text-gray-900">No-Show Passengers</h3>
              </div>
              <button
                onClick={() => setShowNoShowModal(false)}
                className="p-2 rounded-full hover:bg-gray-100 text-gray-500"
                aria-label="Close"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="px-6 py-4 space-y-4">
              <div className="flex flex-wrap gap-3 items-end">
                <div className="flex-1 min-w-[240px] relative">
                  <label className="text-xs font-semibold text-gray-500 uppercase mb-1 block">Search Name / PNR / Ticket No.</label>
                  <Search className="w-4 h-4 text-gray-400 absolute left-3 top-9 pointer-events-none" />
                  <input
                    value={noShowSearch}
                    onChange={(e) => setNoShowSearch(e.target.value)}
                    placeholder="Enter search term..."
                    className="w-full pl-9 pr-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-500 uppercase mb-1 block">Passenger Type</label>
                  <select
                    value={noShowType}
                    onChange={(e) => setNoShowType(e.target.value)}
                    className="w-48 px-3 py-2 border border-gray-200 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="All">All (ADT/CHD/INF)</option>
                    <option value="ADT">ADT</option>
                    <option value="CHD">CHD</option>
                    <option value="INF">INF</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-500 uppercase mb-1 block">Status</label>
                  <select
                    value={noShowStatus}
                    onChange={(e) => setNoShowStatus(e.target.value)}
                    className="w-40 px-3 py-2 border border-gray-200 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="All">All</option>
                    <option value="NO SHOW">No Show</option>
                    <option value="RE-ISSUED">Re-issued</option>
                    <option value="REFUNDED">Refunded</option>
                  </select>
                </div>
                <button
                  onClick={() => setNoShowSearch(noShowSearch.trim())}
                  className="px-4 py-2 text-sm font-semibold text-white bg-[#003366] rounded-lg hover:bg-[#004080]"
                >
                  Apply Filters
                </button>
                <button
                  onClick={() => {
                    setNoShowSearch('');
                    setNoShowType('All');
                    setNoShowStatus('NO SHOW');
                  }}
                  className="px-4 py-2 text-sm font-semibold text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-100"
                >
                  Clear
                </button>
              </div>

              <div className="border border-gray-200 rounded-lg overflow-hidden">
                <div className="grid grid-cols-8 bg-gray-50 text-xs font-semibold text-gray-600 uppercase">
                  <div className="px-4 py-2">Name</div>
                  <div className="px-4 py-2">Type</div>
                  <div className="px-4 py-2">PNR</div>
                  <div className="px-4 py-2">Baggage</div>
                  <div className="px-4 py-2">Status</div>
                  <div className="px-4 py-2">Current Status</div>
                  <div className="px-4 py-2">Ticket Number</div>
                  <div className="px-4 py-2">Coupon Number</div>
                </div>
                <div className="max-h-80 overflow-y-auto divide-y divide-gray-100">
                  {filteredNoShow.map((p, idx) => (
                    <div key={`${p.pnr}-${idx}`} className="grid grid-cols-8 text-sm text-gray-700 hover:bg-gray-50">
                      <div className="px-4 py-2">{p.name}</div>
                      <div className="px-4 py-2">{p.type}</div>
                      <div className="px-4 py-2 font-mono">{p.pnr}</div>
                      <div className="px-4 py-2">{p.baggage}</div>
                      <div className="px-4 py-2 font-semibold text-red-600">{p.status}</div>
                      <div className="px-4 py-2 font-semibold text-gray-900">{p.currentStatus}</div>
                      <div className="px-4 py-2 font-mono text-xs">{p.ticket}</div>
                      <div className="px-4 py-2 font-mono text-xs">{p.coupon}</div>
                    </div>
                  ))}
                  {filteredNoShow.length === 0 && (
                    <div className="px-4 py-6 text-center text-sm text-gray-500">No passengers found.</div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Dashboard;
