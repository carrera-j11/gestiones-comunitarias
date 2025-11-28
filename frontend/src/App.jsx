// frontend/src/App.jsx
import { Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import AdminSpacesPage from './pages/AdminSpacesPage';
import CitizenReservationsPage from './pages/CitizenReservationsPage';
import ManageReservationsPage from './pages/ManageReservationsPage';
import CitizenIncidentsPage from './pages/CitizenIncidentsPage';
import ResponsibleIncidentsPage from './pages/ResponsibleIncidentsPage';
import ReservationReportPage from './pages/ReservationReportPage';
import PrivateRoute from './components/PrivateRoute';

export default function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* Reservas del ciudadano */}
        <Route
          path="/reservations"
          element={
            <PrivateRoute roles={['USER']}>
              <CitizenReservationsPage />
            </PrivateRoute>
          }
        />

        {/* Gestión de reservas (ADMIN / RESPONSABLE) */}
        <Route
          path="/reservations/manage"
          element={
            <PrivateRoute roles={['ADMIN', 'RESPONSABLE']}>
              <ManageReservationsPage />
            </PrivateRoute>
          }
        />

        {/* Reporte de reservas (ADMIN / RESPONSABLE) */}
        <Route
          path="/reservations/report"
          element={
            <PrivateRoute roles={['ADMIN', 'RESPONSABLE']}>
              <ReservationReportPage />
            </PrivateRoute>
          }
        />

        {/* Reporte de incidentes (ciudadano) */}
        <Route
          path="/incidents"
          element={
            <PrivateRoute roles={['USER']}>
              <CitizenIncidentsPage />
            </PrivateRoute>
          }
        />

        {/* Gestión de incidentes (responsable / admin) */}
        <Route
          path="/responsable/incidents"
          element={
            <PrivateRoute roles={['ADMIN', 'RESPONSABLE']}>
              <ResponsibleIncidentsPage />
            </PrivateRoute>
          }
        />

        {/* Gestión de espacios (admin) */}
        <Route
          path="/admin/spaces"
          element={
            <PrivateRoute roles={['ADMIN']}>
              <AdminSpacesPage />
            </PrivateRoute>
          }
        />

        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </>
  );
}
