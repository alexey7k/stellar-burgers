import { FC, useEffect } from 'react';
import { Preloader } from '../../ui';
import { FeedUI } from '../../ui/pages';
import { useDispatch, useSelector } from '../../services/store';
import { getFeeds } from '../../services/slices/feedSlice';

export const Feed: FC = () => {
  const dispatch = useDispatch();
  const { orders, loading } = useSelector((state) => state.feed);

  useEffect(() => {
    // Запускаем WebSocket-ленту
    dispatch({ type: 'feed/startFeed' });

    return () => {
      // Останавливаем WebSocket при размонтировании
      dispatch({ type: 'feed/stopFeed' });
    };
  }, [dispatch]);

  const handleGetFeeds = () => {
    // Кнопка «Обновить» делает повторный запрос к API
    dispatch(getFeeds());
  };

  if (loading) {
    return <Preloader />;
  }

  return <FeedUI orders={orders} handleGetFeeds={handleGetFeeds} />;
};
