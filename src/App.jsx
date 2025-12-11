import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import FlightList from './pages/FlightList';
import AdminDashboard from './components/Administration/AdminDashboard';
import AircraftList from './components/Administration/AircraftList';
import CreateAircraft from './components/Administration/CreateAircraft';
import CreateSeatmap from './components/Administration/CreateSeatmap';
import CreateCabin from './components/Administration/CreateCabin';

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/flight-list" element={<FlightList />} />
          <Route path="/check-in" element={<div className="p-6 text-gray-600">Check-in Counters - Coming Soon</div>} />
          <Route path="/boarding" element={<div className="p-6 text-gray-600">Boarding Gates - Coming Soon</div>} />
          <Route path="/weight" element={<div className="p-6 text-gray-600">Weight and Balance - Coming Soon</div>} />
          <Route path="/baggage" element={<div className="p-6 text-gray-600">Baggage - Coming Soon</div>} />
          <Route path="/passengers" element={<div className="p-6 text-gray-600">Passenger List - Coming Soon</div>} />
          <Route path="/reports" element={<div className="p-6 text-gray-600">Reports & Statistics - Coming Soon</div>} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/aircraft" element={<AircraftList />} />
          <Route path="/admin/aircraft/new" element={<CreateAircraft />} />
          <Route path="/admin/aircraft/:id" element={<CreateAircraft />} />
          <Route path="/admin/seatmap" element={<CreateSeatmap />} />
          <Route path="/admin/seatmap/:id" element={<CreateSeatmap />} />
          <Route path="/admin/cabin/new" element={<CreateCabin />} />
          <Route path="/settings" element={<div className="p-6 text-gray-600">Settings - Coming Soon</div>} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
