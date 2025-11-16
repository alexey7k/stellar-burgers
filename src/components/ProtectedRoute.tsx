import { FC } from 'react';
import { Navigate, useLocation, Location } from 'react-router-dom';
import { useSelector } from '../services/store';

type ProtectedRouteProps = {
  /** Маршрут доступен только НЕавторизованным (login, register и т.п.) */
  onlyUnAuth?: boolean;
  children: JSX.Element;
};

export const ProtectedRoute: FC<ProtectedRouteProps> = ({
  onlyUnAuth = false,
  children
}) => {
  const isAuth = useSelector((state) => state.user.isAuth);
  const location = useLocation();

  // Маршруты, доступные только НЕавторизованным пользователям
  if (onlyUnAuth) {
    if (isAuth) {
      // Пользователь уже авторизован:
      // возвращаем туда, куда он хотел попасть, либо на главную.
      const state = location.state as { from?: Location } | null;
      const from = state?.from;
      return <Navigate to={from?.pathname || '/'} replace />;
    }

    // Неавторизованный пользователь может видеть страницу логина/регистрации
    return children;
  }

  // Обычный защищённый маршрут (только для авторизованных)
  if (!isAuth) {
    // Запоминаем, откуда пользователь пришёл, чтобы вернуть его после логина
    return <Navigate to='/login' state={{ from: location }} replace />;
  }

  // Авторизованный пользователь видит защищённый контент
  return children;
};
