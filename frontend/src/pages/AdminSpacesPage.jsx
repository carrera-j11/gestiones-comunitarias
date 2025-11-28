import { useEffect, useState } from 'react';
import api from '../services/api';

export default function AdminSpacesPage() {
  const [spaces, setSpaces] = useState([]);
  const [form, setForm] = useState({
    name: '',
    type: '',
    location: '',
    capacity: 1
  });
  const [error, setError] = useState('');

  const loadSpaces = async () => {
    try {
      const res = await api.get('/spaces');
      setSpaces(res.data);
    } catch (err) {
      console.error(err);
      setError('No se pudieron cargar los espacios');
    }
  };

  useEffect(() => {
    loadSpaces();
  }, []);

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setError('');
    try {
      await api.post('/spaces', {
        name: form.name,
        type: form.type,
        location: form.location,
        capacity: Number(form.capacity)
      });
      setForm({ name: '', type: '', location: '', capacity: 1 });
      loadSpaces();
    } catch (err) {
      console.error(err);
      setError(err?.response?.data?.error || 'Error al crear espacio');
    }
  };

  return (
    <div className="page">
      <h2>Gestión de espacios (ADMIN)</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Nombre</label>
          <input name="name" value={form.name} onChange={handleChange} />
        </div>
        <div className="form-group">
          <label>Tipo</label>
          <input name="type" value={form.type} onChange={handleChange} />
        </div>
        <div className="form-group">
          <label>Ubicación</label>
          <input name="location" value={form.location} onChange={handleChange} />
        </div>
        <div className="form-group">
          <label>Capacidad</label>
          <input
            type="number"
            name="capacity"
            min={1}
            value={form.capacity}
            onChange={handleChange}
          />
        </div>
        {error && <div className="error">{error}</div>}
        <button>Guardar</button>
      </form>

      <h3 style={{ marginTop: 32 }}>Espacios registrados</h3>
      <ul>
        {spaces.map(s => (
          <li key={s.id}>
            {s.name} — {s.type} — {s.location} — Capacidad: {s.capacity}
          </li>
        ))}
      </ul>
    </div>
  );
}
