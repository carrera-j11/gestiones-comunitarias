import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { user, logout } = useAuth();

  return (
    <div className="navbar">
      <div>SGCE</div>
      <div>
        <Link to="/">Inicio</Link>

        {!user && <Link to="/login">Ingresar</Link>}

        {user?.role === 'USER' && (
          <>
            <Link to="/reservations">Reservar espacio</Link>
            <Link to="/incidents">Reportar incidente</Link>
          </>
        )}

        {user?.role === 'RESPONSABLE' && (
          <>
            <Link to="/responsable/incidents">Gestionar incidentes</Link>
            <Link to="/reservations/manage">Reservas</Link>
            <Link to="/reservations/report">Reporte reservas</Link>
          </>
        )}

        {user?.role === 'ADMIN' && (
          <>
            <Link to="/admin/spaces">Espacios</Link>
            <Link to="/reservations/manage">Reservas</Link>
            <Link to="/reservations/report">Reporte reservas</Link>
          </>
        )}

        {user && (
          <button style={{ marginLeft: 12 }} onClick={logout}>
            Salir
          </button>
        )}
      </div>
    </div>
  );
}
