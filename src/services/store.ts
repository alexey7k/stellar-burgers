import { configureStore } from '@reduxjs/toolkit';
import type { Middleware } from '@reduxjs/toolkit';
import { rootReducer } from './rootReducer';
import {
  TypedUseSelectorHook,
  useDispatch as dispatchHook,
  useSelector as selectorHook
} from 'react-redux';
import { getCookie } from '../utils/cookie';

const WS_BASE_URL = process.env.BURGER_API_URL
  ? process.env.BURGER_API_URL.replace('http', 'ws').replace('/api', '/orders')
  : 'wss://norma.nomoreparties.space/orders';

let socket: WebSocket | null = null;

// Экшены, с которыми умеет работать socketMiddleware
type ActionWithType = {
  type: string;
};

// Type guard: сузить unknown до объекта с полем type
const isActionWithType = (action: unknown): action is ActionWithType =>
  typeof action === 'object' &&
  action !== null &&
  'type' in action &&
  typeof (action as { type: unknown }).type === 'string';

const socketMiddleware: Middleware = (store) => (next) => (action) => {
  // Если это не redux-экшен с полем type — просто пробрасываем дальше
  if (!isActionWithType(action)) {
    return next(action);
  }

  if (action.type === 'feed/startFeed') {
    // Открываем WS для общей ленты
    if (socket) {
      socket.close();
    }

    socket = new WebSocket(`${WS_BASE_URL}/all`);

    socket.onmessage = (event: MessageEvent) => {
      const data = JSON.parse(event.data);
      store.dispatch({ type: 'feed/setFeedData', payload: data });
    };
  } else if (action.type === 'order/startUserFeed') {
    // Открываем WS для ленты заказов пользователя
    if (socket) {
      socket.close();
    }

    const token = getCookie('accessToken');
    const accessToken = token ? token.replace('Bearer ', '') : '';

    socket = new WebSocket(`${WS_BASE_URL}?token=${accessToken}`);

    socket.onmessage = (event: MessageEvent) => {
      const data = JSON.parse(event.data);
      store.dispatch({ type: 'order/setUserOrders', payload: data });
    };
  } else if (
    action.type === 'feed/stopFeed' ||
    action.type === 'order/stopUserFeed'
  ) {
    // Закрываем WS при выходе с страниц ленты
    if (socket) {
      socket.close();
      socket = null;
    }
  }

  return next(action);
};

export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(socketMiddleware),
  devTools: process.env.NODE_ENV !== 'production'
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useDispatch: () => AppDispatch = () => dispatchHook();
export const useSelector: TypedUseSelectorHook<RootState> = selectorHook;

export default store;
