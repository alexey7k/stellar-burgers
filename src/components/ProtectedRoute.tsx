import { FC } from 'react';
import { Navigate } from 'react-router-dom';
import { useSelector } from '../services/store';

export const ProtectedRoute: FC<{ children: JSX.Element }> = ({ children }) => {
  const isAuth = useSelector((state) => state.user.isAuth);
  return isAuth ? children : <Navigate to='/login' replace />;
};
