import orderReducer, { createOrder, fetchUserOrders } from './orderSlice';

type OrderState = ReturnType<typeof orderReducer>;

const mockOrder = {
  _id: '123',
  number: 1,
  name: 'Тестовый заказ'
};

const mockUserOrders = [
  { _id: '1', number: 10, name: 'Заказ 10' },
  { _id: '2', number: 11, name: 'Заказ 11' }
];

describe('orderSlice reducer', () => {
  it('ставит loading в true и очищает ошибку при createOrder.pending', () => {
    const state: OrderState = orderReducer(undefined, {
      type: createOrder.pending.type
    });

    expect(state.loading).toBe(true);
    expect(state.error).toBeUndefined();
    expect(state.currentOrder).toBeNull();
  });

  it('сохраняет заказ и сбрасывает loading при createOrder.fulfilled', () => {
    const loadingState: OrderState = orderReducer(undefined, {
      type: createOrder.pending.type
    });

    const state: OrderState = orderReducer(loadingState, {
      type: createOrder.fulfilled.type,
      payload: mockOrder
    });

    expect(state.loading).toBe(false);
    expect(state.currentOrder).toEqual(mockOrder);
    expect(state.error).toBeUndefined();
  });

  it('сохраняет ошибку и сбрасывает loading при createOrder.rejected', () => {
    const loadingState: OrderState = orderReducer(undefined, {
      type: createOrder.pending.type
    });

    const errorMessage = 'Failed to create order';

    const state: OrderState = orderReducer(loadingState, {
      type: createOrder.rejected.type,
      error: { message: errorMessage }
    });

    expect(state.loading).toBe(false);
    expect(state.error).toBe(errorMessage);
  });

  it('ставит loading в true и очищает ошибку при fetchUserOrders.pending', () => {
    const state: OrderState = orderReducer(undefined, {
      type: fetchUserOrders.pending.type
    });

    expect(state.loading).toBe(true);
    expect(state.error).toBeUndefined();
  });

  it('сохраняет userOrders и сбрасывает loading при fetchUserOrders.fulfilled', () => {
    const loadingState: OrderState = orderReducer(undefined, {
      type: fetchUserOrders.pending.type
    });

    const state: OrderState = orderReducer(loadingState, {
      type: fetchUserOrders.fulfilled.type,
      payload: mockUserOrders
    });

    expect(state.loading).toBe(false);
    expect(state.userOrders).toEqual(mockUserOrders);
    expect(state.error).toBeUndefined();
  });

  it('сохраняет ошибку и сбрасывает loading при fetchUserOrders.rejected', () => {
    const loadingState: OrderState = orderReducer(undefined, {
      type: fetchUserOrders.pending.type
    });

    const errorMessage = 'Failed to fetch user orders';

    const state: OrderState = orderReducer(loadingState, {
      type: fetchUserOrders.rejected.type,
      error: { message: errorMessage }
    });

    expect(state.loading).toBe(false);
    expect(state.error).toBe(errorMessage);
  });
});
