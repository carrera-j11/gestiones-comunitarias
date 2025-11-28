import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async e => {
    e.preventDefault();
    setError('');
    try {
      const user = await login(email, password);
      if (user.role === 'ADMIN') navigate('/admin/spaces');
      else if (user.role === 'RESPONSABLE') navigate('/responsable/incidents');
      else navigate('/reservations');
    } catch (err) {
      setError(err?.response?.data?.error || 'Error al iniciar sesión');
    }
  };

  return (
    <div className="page">
      <h2>Ingreso al sistema</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Correo</label>
          <input
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label>Contraseña</label>
          <input
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
          />
        </div>
        {error && <div className="error">{error}</div>}
        <button>Ingresar</button>
      </form>
      <p style={{ marginTop: 12 }}>
        ¿No tienes cuenta? <Link to="/register">Registrarse</Link>
      </p>
    </div>
  );
}
