import { useEffect, useState } from 'react';
import api from '../services/api';

export default function CitizenReservationsPage() {
  const [spaces, setSpaces] = useState([]);
  const [reservations, setReservations] = useState([]);

  const [spaceId, setSpaceId] = useState('');
  const [date, setDate] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [purpose, setPurpose] = useState('');
  const [msg, setMsg] = useState('');
  const [error, setError] = useState('');
  const [cancelReasons, setCancelReasons] = useState({});

  const loadSpaces = async () => {
    const res = await api.get('/spaces');
    setSpaces(res.data);
  };

  const loadMyReservations = async () => {
    const res = await api.get('/reservations/mine');
    setReservations(res.data);
  };

  useEffect(() => {
    loadSpaces();
    loadMyReservations();
  }, []);

  const submit = async e => {
    e.preventDefault();
    setMsg('');
    setError('');

    try {
      await api.post('/reservations', {
        spaceId,
        date,
        startTime,
        endTime,
        purpose
      });
      setMsg('Reserva enviada correctamente');
      setSpaceId('');
      setDate('');
      setStartTime('');
      setEndTime('');
      setPurpose('');
      await loadMyReservations();
    } catch (err) {
      console.error(err);
      setError(err?.response?.data?.error || 'Error al crear reserva');
    }
  };

  const handleCancelChange = (id, value) => {
    setCancelReasons(prev => ({ ...prev, [id]: value }));
  };

  const cancelReservation = async id => {
    const reason = cancelReasons[id];
    if (!reason) {
      alert('Debe indicar el motivo de cancelación');
      return;
    }
    try {
      await api.put(`/reservations/${id}/cancel`, { reason });
      await loadMyReservations();
    } catch (err) {
      console.error(err);
      alert(err?.response?.data?.error || 'Error al cancelar reserva');
    }
  };

  return (
    <div className="page">
      <h2>Reservar espacio</h2>
      <form onSubmit={submit}>
        <div className="form-group">
          <label>Espacio</label>
          <select value={spaceId} onChange={e => setSpaceId(e.target.value)} required>
            <option value="">Seleccione...</option>
            {spaces.map(s => (
              <option key={s.id} value={s.id}>
                {s.name} ({s.location})
              </option>
            ))}
          </select>
        </div>
        <div className="form-group">
          <label>Fecha</label>
          <input type="date" value={date} onChange={e => setDate(e.target.value)} required />
        </div>
        <div className="form-group">
          <label>Hora de inicio</label>
          <input
            type="time"
            value={startTime}
            onChange={e => setStartTime(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label>Hora de fin</label>
          <input
            type="time"
            value={endTime}
            onChange={e => setEndTime(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label>Motivo / Actividad</label>
          <textarea
            value={purpose}
            onChange={e => setPurpose(e.target.value)}
            rows={3}
            required
          />
        </div>
        {error && <div className="error">{error}</div>}
        {msg && <div>{msg}</div>}
        <button>Enviar solicitud</button>
      </form>

      <h3 style={{ marginTop: 32 }}>Mis reservas</h3>
      <ul>
        {reservations.map(r => (
          <li key={r.id} style={{ marginBottom: 8 }}>
            Espacio #{r.spaceId} — {r.date} {r.startTime}-{r.endTime} — {r.purpose} —{' '}
            <strong>{r.status}</strong>
            {r.status === 'CANCELADA' && r.cancelReason && (
              <> (Motivo cancelación: {r.cancelReason})</>
            )}
            {r.status === 'APROBADA' && (
              <div style={{ marginTop: 4 }}>
                <input
                  type="text"
                  placeholder="Motivo de cancelación"
                  value={cancelReasons[r.id] || ''}
                  onChange={e => handleCancelChange(r.id, e.target.value)}
                  style={{ width: 260, marginRight: 8 }}
                />
                <button type="button" onClick={() => cancelReservation(r.id)}>
                  Cancelar reserva
                </button>
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
