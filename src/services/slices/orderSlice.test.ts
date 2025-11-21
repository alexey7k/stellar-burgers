import orderReducer, { createOrder, fetchUserOrders } from './orderSlice';

const mockOrder = {
  _id: '123',
  number: 1,
  name: 'Тестовый заказ'
} as any;

const mockUserOrders = [
  { _id: '1', number: 10, name: 'Заказ 10' } as any,
  { _id: '2', number: 11, name: 'Заказ 11' } as any
];

describe('orderSlice reducer', () => {
  // ---------- createOrder ----------
  it('ставит флаг загрузки в true и очищает ошибку при createOrder.pending', () => {
    const state = orderReducer(undefined, {
      type: createOrder.pending.type
    } as any);

    expect((state as any).loading).toBe(true);
    expect((state as any).error).toBeUndefined();
    expect((state as any).currentOrder).toBeNull();
  });

  it('сохраняет данные заказа и сбрасывает флаг загрузки при createOrder.fulfilled', () => {
    const loadingState = orderReducer(undefined, {
      type: createOrder.pending.type
    } as any);

    const state = orderReducer(loadingState, {
      type: createOrder.fulfilled.type,
      payload: mockOrder
    } as any);

    expect((state as any).loading).toBe(false);
    expect((state as any).currentOrder).toEqual(mockOrder);
    expect((state as any).error).toBeUndefined();
  });

  it('сохраняет ошибку и сбрасывает флаг загрузки при createOrder.rejected', () => {
    const loadingState = orderReducer(undefined, {
      type: createOrder.pending.type
    } as any);

    const errorMessage = 'Failed to create order';

    const state = orderReducer(loadingState, {
      type: createOrder.rejected.type,
      error: { message: errorMessage }
    } as any);

    expect((state as any).loading).toBe(false);
    expect((state as any).error).toBe(errorMessage);
  });

  // ---------- fetchUserOrders ----------
  it('ставит флаг загрузки в true и очищает ошибку при fetchUserOrders.pending', () => {
    const state = orderReducer(undefined, {
      type: fetchUserOrders.pending.type
    } as any);

    expect((state as any).loading).toBe(true);
    expect((state as any).error).toBeUndefined();
  });

  it('сохраняет userOrders и сбрасывает флаг загрузки при fetchUserOrders.fulfilled', () => {
    const loadingState = orderReducer(undefined, {
      type: fetchUserOrders.pending.type
    } as any);

    const state = orderReducer(loadingState, {
      type: fetchUserOrders.fulfilled.type,
      payload: mockUserOrders
    } as any);

    expect((state as any).loading).toBe(false);
    expect((state as any).userOrders).toEqual(mockUserOrders);
    expect((state as any).error).toBeUndefined();
  });

  it('сохраняет ошибку и сбрасывает флаг загрузки при fetchUserOrders.rejected', () => {
    const loadingState = orderReducer(undefined, {
      type: fetchUserOrders.pending.type
    } as any);

    const errorMessage = 'Failed to fetch user orders';

    const state = orderReducer(loadingState, {
      type: fetchUserOrders.rejected.type,
      error: { message: errorMessage }
    } as any);

    expect((state as any).loading).toBe(false);
    expect((state as any).error).toBe(errorMessage);
  });
});
