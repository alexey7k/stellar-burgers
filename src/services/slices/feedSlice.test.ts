import feedReducer, { getFeeds } from './feedSlice';

const mockFeedResponse = {
  orders: [
    { _id: '1', name: 'Заказ 1' } as any,
    { _id: '2', name: 'Заказ 2' } as any
  ],
  total: 42,
  totalToday: 7
};

describe('feedSlice reducer', () => {
  it('ставит флаг загрузки в true при getFeeds.pending', () => {
    const state = feedReducer(undefined, {
      type: getFeeds.pending.type
    } as any);

    expect((state as any).loading).toBe(true);
    expect((state as any).error).toBeUndefined();
  });

  it('сохраняет данные и сбрасывает флаг загрузки при getFeeds.fulfilled', () => {
    const loadingState = feedReducer(undefined, {
      type: getFeeds.pending.type
    } as any);

    const state = feedReducer(loadingState, {
      type: getFeeds.fulfilled.type,
      payload: mockFeedResponse
    } as any);

    expect((state as any).loading).toBe(false);
    expect((state as any).orders).toEqual(mockFeedResponse.orders);
    expect((state as any).total).toBe(mockFeedResponse.total);
    expect((state as any).totalToday).toBe(mockFeedResponse.totalToday);
    expect((state as any).error).toBeUndefined();
  });

  it('сохраняет ошибку и сбрасывает флаг загрузки при getFeeds.rejected', () => {
    const loadingState = feedReducer(undefined, {
      type: getFeeds.pending.type
    } as any);

    const errorMessage = 'Failed to fetch feeds';

    const state = feedReducer(loadingState, {
      type: getFeeds.rejected.type,
      error: { message: errorMessage }
    } as any);

    expect((state as any).loading).toBe(false);
    expect((state as any).error).toBe(errorMessage);
  });
});
