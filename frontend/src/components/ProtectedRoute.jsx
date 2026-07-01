import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../store/AuthContext.jsx';

// Gates routes behind authentication; optionally requires the admin role.
// `loginPath` controls where unauthenticated visitors are sent.
export default function ProtectedRoute({ children, adminOnly = false, loginPath = '/login' }) {
  const { user, loading, isAdmin } = useAuth();
  const location = useLocation();

  if (loading) {
    return <div className="full-loading">Loading…</div>;
  }
  if (!user) {
    return <Navigate to={loginPath} replace state={{ from: location.pathname }} />;
  }
  if (adminOnly && !isAdmin) {
    // Logged in but not an admin — send to the admin login (which will reject non-admins).
    return <Navigate to="/admin/login" replace />;
  }
  return children;
}
