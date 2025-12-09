const StatusBadge = ({ status, isDashboard = false }) => {
  if (status === 'CKC-BDO') {
    return (
      <span className={`font-bold flex items-center ${isDashboard ? 'text-lg' : 'text-sm'}`}>
        <span className="text-red-600">CKC</span>
        <span className="text-gray-400 mx-1">-</span>
        <span className="text-green-600">BDO</span>
      </span>
    );
  }

  let colorClass = 'text-gray-600';
  let displayText = status;

  switch (status) {
    case 'CKC-BDC':
    case 'Closed':
    case 'XLD':
      colorClass = 'text-red-600';
      break;
    case 'CKO':
      colorClass = 'text-green-600';
      if (isDashboard) displayText = 'Check-in Open';
      break;
    case 'BDO':
      colorClass = 'text-green-600';
      if (isDashboard) displayText = 'Boarding Open';
      break;
    case 'OPN':
      colorClass = 'text-blue-600';
      if (isDashboard) displayText = 'Open';
      break;
    default:
      colorClass = 'text-gray-600';
  }

  return (
    <span className={`font-bold ${colorClass} ${isDashboard ? 'text-sm' : 'text-sm'}`}>
      {displayText}
    </span>
  );
};

export default StatusBadge;
