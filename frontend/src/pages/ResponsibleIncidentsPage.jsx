import { useEffect, useState } from 'react';
import api from '../services/api';

export default function ResponsibleIncidentsPage() {
  const [incidents, setIncidents] = useState([]);
  const [actionNotes, setActionNotes] = useState({});

  const load = async () => {
    const res = await api.get('/incidents');
    setIncidents(res.data);
  };

  useEffect(() => {
    load();
  }, []);

  const handleNoteChange = (id, value) => {
    setActionNotes(prev => ({ ...prev, [id]: value }));
  };

  const updateStatus = async (id, status) => {
    const note = actionNotes[id];
    if (!note) {
      alert('Debe registrar la acción realizada');
      return;
    }
    try {
      await api.put(`/incidents/${id}/status`, { status, actionNote: note });
      await load();
    } catch (err) {
      console.error(err);
      alert(err?.response?.data?.error || 'Error al actualizar incidente');
    }
  };

  return (
    <div className="page">
      <h2>Gestión de incidentes (RESPONSABLE)</h2>
      <ul>
        {incidents.map(i => (
          <li key={i.id} style={{ marginBottom: 10 }}>
            Espacio #{i.spaceId} — {i.description} —{' '}
            <strong>{i.status}</strong>
            {i.actionNote && <> (Acción: {i.actionNote})</>}
            {i.status !== 'RESUELTO' && (
              <div style={{ marginTop: 4 }}>
                <input
                  type="text"
                  placeholder="Acción realizada"
                  value={actionNotes[i.id] || ''}
                  onChange={e => handleNoteChange(i.id, e.target.value)}
                  style={{ width: 260, marginRight: 8 }}
                />
                {i.status === 'ABIERTO' && (
                  <button onClick={() => updateStatus(i.id, 'EN_PROCESO')}>
                    Marcar en proceso
                  </button>
                )}{' '}
                <button onClick={() => updateStatus(i.id, 'RESUELTO')}>
                  Marcar resuelto
                </button>
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
