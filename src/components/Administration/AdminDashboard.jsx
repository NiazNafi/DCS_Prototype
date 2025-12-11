import { ShieldCheck, Plane, Rows3, Users, ClipboardList, Lock, PlusCircle, Settings } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const adminShortcuts = [
  { label: 'Aircraft List', description: 'Manage fleet registry', icon: Plane, action: 'Open list', path: '/admin/aircraft' },
  { label: 'Create Aircraft', description: 'Add new tail and specs', icon: PlusCircle, action: 'Create', path: '/admin/aircraft/new' },
  { label: 'Create Seatmap', description: 'Configure cabins and rows', icon: Rows3, action: 'Build', path: '/admin/seatmap' },
  { label: 'Create Cabin', description: 'Define cabins per aircraft', icon: ClipboardList, action: 'Add', path: '/admin/cabin/new' },
  { label: 'Role & Access', description: 'Assign permissions', icon: ShieldCheck, action: 'Manage' },
  { label: 'User Directory', description: 'Users and teams', icon: Users, action: 'View' },
  { label: 'Audit Log', description: 'Track changes', icon: ClipboardList, action: 'Open' },
];

const roleAccess = [
  { role: 'Admin', scope: 'Global', aircraft: 'Full', seatmap: 'Full', access: 'Grant/Revoke', audit: 'Full' },
  { role: 'Ops Manager', scope: 'Station', aircraft: 'Edit', seatmap: 'Edit', access: 'Approve', audit: 'View' },
  { role: 'Supervisor', scope: 'Shift', aircraft: 'Edit', seatmap: 'View', access: 'Request', audit: 'View' },
  { role: 'Agent', scope: 'Counter', aircraft: 'View', seatmap: 'View', access: 'Limited', audit: 'View' },
];

const pendingRequests = [
  { id: 'REQ-1042', user: 'Fariha Rahman', role: 'Ops Manager', station: 'DAC', status: 'Awaiting Approval' },
  { id: 'REQ-1043', user: 'Tanvir Ahmed', role: 'Supervisor', station: 'CGP', status: 'Awaiting Approval' },
];

const recentUpdates = [
  { title: 'A330-300 seatmap published', by: 'R. Rahman', time: '2h ago' },
  { title: 'New role: Turnaround Lead', by: 'S. Khan', time: '5h ago' },
  { title: 'Audit export completed', by: 'T. Hossain', time: '1d ago' },
];

const AdminDashboard = () => {
  const navigate = useNavigate();

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-500">Control Center</p>
          <h1 className="text-2xl font-semibold text-gray-800">Administration</h1>
        </div>
        <button className="flex items-center space-x-2 bg-[#003366] text-white px-4 py-2 rounded-lg hover:bg-[#004080] transition">
          <Settings className="w-4 h-4" />
          <span className="text-sm font-semibold">Settings</span>
        </button>
      </div>

      <div className="grid grid-cols-3 gap-4">
        {adminShortcuts.map((item) => {
          const Icon = item.icon;
          return (
            <div
              key={item.label}
              className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm hover:border-blue-300 hover:shadow transition cursor-pointer"
              onClick={() => item.path && navigate(item.path)}
            >
              <div className="flex items-start justify-between">
                <div className="p-2 rounded-lg bg-blue-50 text-[#003366]">
                  <Icon className="w-5 h-5" />
                </div>
                <button
                  className="text-sm text-[#003366] font-semibold"
                  onClick={(e) => {
                    e.stopPropagation();
                    item.path && navigate(item.path);
                  }}
                >
                  {item.action}
                </button>
              </div>
              <h3 className="mt-3 text-base font-semibold text-gray-900">{item.label}</h3>
              <p className="text-sm text-gray-600 mt-1">{item.description}</p>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-3 gap-6">
        <div className="col-span-2 bg-white border border-gray-200 rounded-lg shadow-sm">
          <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
            <div>
              <p className="text-xs text-gray-500 uppercase font-semibold">Role Based Access</p>
              <h2 className="text-lg font-bold text-gray-800">Policy Matrix</h2>
            </div>
            <button className="text-sm font-semibold text-[#003366]">Edit Policies</button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 text-xs uppercase text-gray-600">
                  <th className="text-left px-4 py-3 font-semibold">Role</th>
                  <th className="text-left px-4 py-3 font-semibold">Scope</th>
                  <th className="text-left px-4 py-3 font-semibold">Aircraft</th>
                  <th className="text-left px-4 py-3 font-semibold">Seatmap</th>
                  <th className="text-left px-4 py-3 font-semibold">Access Control</th>
                  <th className="text-left px-4 py-3 font-semibold">Audit</th>
                </tr>
              </thead>
              <tbody>
                {roleAccess.map((row) => (
                  <tr key={row.role} className="border-b border-gray-100 text-sm hover:bg-gray-50">
                    <td className="px-4 py-3 font-semibold text-gray-900">{row.role}</td>
                    <td className="px-4 py-3 text-gray-700">{row.scope}</td>
                    <td className="px-4 py-3 text-gray-700">{row.aircraft}</td>
                    <td className="px-4 py-3 text-gray-700">{row.seatmap}</td>
                    <td className="px-4 py-3 text-gray-700">{row.access}</td>
                    <td className="px-4 py-3 text-gray-700">{row.audit}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 rounded-lg shadow-sm">
          <div className="px-5 py-4 border-b border-blue-100">
            <p className="text-xs text-gray-600 uppercase font-semibold">Access Requests</p>
            <h2 className="text-lg font-bold text-gray-800">Pending Approvals</h2>
          </div>
          <div className="divide-y divide-blue-100">
            {pendingRequests.map((req) => (
              <div key={req.id} className="px-5 py-4 flex items-start justify-between">
                <div>
                  <p className="text-xs text-gray-500">{req.id} - {req.station}</p>
                  <h3 className="text-sm font-semibold text-gray-900">{req.user}</h3>
                  <p className="text-xs text-gray-600 mt-1">{req.role}</p>
                  <span className="mt-2 inline-flex items-center text-[10px] font-semibold text-orange-700 bg-orange-100 px-2 py-1 rounded-full">
                    {req.status}
                  </span>
                </div>
                <div className="space-y-2">
                  <button className="text-sm font-semibold text-[#003366] bg-white border border-blue-200 px-3 py-1.5 rounded-lg hover:bg-blue-50">
                    Approve
                  </button>
                  <button className="text-sm font-semibold text-gray-600 border border-gray-200 px-3 py-1.5 rounded-lg hover:bg-gray-50">
                    Decline
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-6">
        <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-500 uppercase font-semibold">Fleet</p>
              <h3 className="text-lg font-bold text-gray-800">Aircraft Summary</h3>
            </div>
            <Plane className="w-5 h-5 text-[#003366]" />
          </div>
          <div className="mt-4 space-y-3 text-sm text-gray-700">
            <div className="flex justify-between">
              <span>Narrow Body</span>
              <span className="font-semibold">18</span>
            </div>
            <div className="flex justify-between">
              <span>Wide Body</span>
              <span className="font-semibold">7</span>
            </div>
            <div className="flex justify-between">
              <span>Seatmaps Published</span>
              <span className="font-semibold">23 / 25</span>
            </div>
            <div className="flex justify-between">
              <span>Pending Approvals</span>
              <span className="font-semibold text-orange-600">3</span>
            </div>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-500 uppercase font-semibold">Access Control</p>
              <h3 className="text-lg font-bold text-gray-800">Role Coverage</h3>
            </div>
            <Lock className="w-5 h-5 text-[#003366]" />
          </div>
          <div className="mt-4 space-y-2 text-sm text-gray-700">
            <div className="flex items-center justify-between">
              <span>Admin / Ops</span>
              <span className="font-semibold">12</span>
            </div>
            <div className="flex items-center justify-between">
              <span>Supervisors</span>
              <span className="font-semibold">24</span>
            </div>
            <div className="flex items-center justify-between">
              <span>Agents</span>
              <span className="font-semibold">146</span>
            </div>
            <div className="flex items-center justify-between">
              <span>Pending Provision</span>
              <span className="font-semibold text-orange-600">5</span>
            </div>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-500 uppercase font-semibold">Activity</p>
              <h3 className="text-lg font-bold text-gray-800">Recent Updates</h3>
            </div>
            <ClipboardList className="w-5 h-5 text-[#003366]" />
          </div>
          <div className="mt-4 space-y-3 text-sm text-gray-700">
            {recentUpdates.map((item) => (
              <div key={item.title}>
                <p className="font-semibold text-gray-900">{item.title}</p>
                <p className="text-xs text-gray-500">By {item.by} - {item.time}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
