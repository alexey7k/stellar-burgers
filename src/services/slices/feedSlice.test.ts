import feedReducer, { getFeeds } from './feedSlice';

type FeedState = ReturnType<typeof feedReducer>;

const mockFeedResponse = {
  orders: [
    { _id: '1', name: 'Заказ 1' },
    { _id: '2', name: 'Заказ 2' }
  ],
  total: 42,
  totalToday: 7
};

describe('feedSlice reducer', () => {
  it('ставит флаг загрузки в true при getFeeds.pending', () => {
    const state: FeedState = feedReducer(undefined, {
      type: getFeeds.pending.type
    });

    expect(state.loading).toBe(true);
    expect(state.error).toBeUndefined();
  });

  it('сохраняет данные и сбрасывает флаг загрузки при getFeeds.fulfilled', () => {
    const loadingState: FeedState = feedReducer(undefined, {
      type: getFeeds.pending.type
    });

    const state: FeedState = feedReducer(loadingState, {
      type: getFeeds.fulfilled.type,
      payload: mockFeedResponse
    });

    expect(state.loading).toBe(false);
    expect(state.orders).toEqual(mockFeedResponse.orders);
    expect(state.total).toBe(mockFeedResponse.total);
    expect(state.totalToday).toBe(mockFeedResponse.totalToday);
    expect(state.error).toBeUndefined();
  });

  it('сохраняет ошибку и сбрасывает флаг загрузки при getFeeds.rejected', () => {
    const loadingState: FeedState = feedReducer(undefined, {
      type: getFeeds.pending.type
    });

    const errorMessage = 'Failed to fetch feeds';

    const state: FeedState = feedReducer(loadingState, {
      type: getFeeds.rejected.type,
      error: { message: errorMessage }
    });

    expect(state.loading).toBe(false);
    expect(state.error).toBe(errorMessage);
  });
});
