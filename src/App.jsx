import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import FlightList from './pages/FlightList';

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
          <Route path="/admin" element={<div className="p-6 text-gray-600">Administration - Coming Soon</div>} />
          <Route path="/settings" element={<div className="p-6 text-gray-600">Settings - Coming Soon</div>} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
