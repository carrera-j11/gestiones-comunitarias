import { useEffect, useState } from 'react';
import api from '../services/api';

export default function ManageReservationsPage() {
  const [reservations, setReservations] = useState([]);

  const load = async () => {
    const res = await api.get('/reservations');
    setReservations(res.data);
  };

  useEffect(() => {
    load();
  }, []);

  const updateStatus = async (id, status) => {
    await api.put(`/reservations/${id}/status`, { status });
    load();
  };

  return (
    <div className="page">
      <h2>Gestión de reservas (ADMIN)</h2>
      <ul>
        {reservations.map(r => (
          <li key={r.id} style={{ marginBottom: 8 }}>
            Espacio #{r.spaceId} — {r.date} {r.startTime}-{r.endTime} — {r.purpose} —{' '}
            <strong>{r.status}</strong>
            {r.cancelReason && <> (Cancelada: {r.cancelReason})</>}
            {r.status === 'PENDIENTE' && (
              <>
                {' '}
                <button onClick={() => updateStatus(r.id, 'APROBADA')}>Aprobar</button>{' '}
                <button onClick={() => updateStatus(r.id, 'RECHAZADA')}>Rechazar</button>
              </>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
