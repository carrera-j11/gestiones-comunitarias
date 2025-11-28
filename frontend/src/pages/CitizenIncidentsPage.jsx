import { useEffect, useState } from 'react';
import api from '../services/api';

export default function CitizenIncidentsPage() {
  const [spaces, setSpaces] = useState([]);
  const [spaceId, setSpaceId] = useState('');
  const [description, setDescription] = useState('');
  const [msg, setMsg] = useState('');

  const loadSpaces = async () => {
    const res = await api.get('/spaces');
    setSpaces(res.data);
  };

  useEffect(() => {
    loadSpaces();
  }, []);

  const submit = async e => {
    e.preventDefault();
    setMsg('');
    try {
      await api.post('/incidents', { spaceId, description });
      setMsg('Incidente reportado correctamente');
      setSpaceId('');
      setDescription('');
    } catch (err) {
      console.error(err);
      setMsg(err?.response?.data?.error || 'Error al reportar incidente');
    }
  };

  return (
    <div className="page">
      <h2>Reportar incidente</h2>
      <form onSubmit={submit}>
        <div className="form-group">
          <label>Espacio</label>
          <select
            value={spaceId}
            onChange={e => setSpaceId(e.target.value)}
            required
          >
            <option value="">Seleccione...</option>
            {spaces.map(s => (
              <option key={s.id} value={s.id}>
                {s.name} ({s.location})
              </option>
            ))}
          </select>
        </div>
        <div className="form-group">
          <label>Descripción</label>
          <textarea
            value={description}
            onChange={e => setDescription(e.target.value)}
            rows={3}
            required
          />
        </div>
        {msg && <div>{msg}</div>}
        <button>Enviar</button>
      </form>
    </div>
  );
}
