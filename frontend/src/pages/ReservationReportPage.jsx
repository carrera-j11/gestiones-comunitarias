import { useEffect, useState } from 'react';
import api from '../services/api';

export default function ReservationReportPage() {
  const [report, setReport] = useState(null);

  const load = async () => {
    const res = await api.get('/reservations/report');
    setReport(res.data);
  };

  useEffect(() => {
    load();
  }, []);

  if (!report) {
    return (
      <div className="page">
        <h2>Reporte de reservas</h2>
        <p>Cargando...</p>
      </div>
    );
  }

  return (
    <div className="page">
      <h2>Reporte de reservas</h2>
      <p>Total de reservas: {report.total}</p>

      <h3>Por estado</h3>
      <ul>
        {Object.entries(report.byStatus).map(([status, count]) => (
          <li key={status}>
            {status}: {count}
          </li>
        ))}
      </ul>

      <h3>Por espacio</h3>
      <ul>
        {report.bySpace.map(s => (
          <li key={s.spaceId}>
            {s.spaceName} (ID {s.spaceId}) — {s.total} reservas
          </li>
        ))}
      </ul>
    </div>
  );
}
