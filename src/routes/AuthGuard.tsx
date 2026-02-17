import { useEffect } from 'react';
import { useNavigate, Outlet } from 'react-router-dom';
import { useAuthStore } from '@stores/useAuthStore';

export default function AuthGuard() {
  const { token, user, hydrate } = useAuthStore();
  const navigate = useNavigate();

  useEffect(() => {
    if (!token) {
      navigate('/login', { replace: true });
      return;
    }
    if (!user && token) {
      hydrate();
    }
  }, [token, user, navigate, hydrate]);

  if (!token) return null;

  return <Outlet />;
}
