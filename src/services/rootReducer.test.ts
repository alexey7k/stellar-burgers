import { rootReducer } from './rootReducer';
import constructorReducer from './slices/constructorSlice';
import ingredientsReducer from './slices/ingredientsSlice';
import orderReducer from './slices/orderSlice';
import userReducer from './slices/userSlice';
import feedReducer from './slices/feedSlice';

describe('rootReducer', () => {
  it('возвращает корректное начальное состояние для неизвестного экшена', () => {
    const initialState = rootReducer(undefined, { type: '@@INIT' });
    const state = rootReducer(undefined, { type: 'UNKNOWN_ACTION' });

    expect(state).toEqual(initialState);
    expect(state).toHaveProperty('ingredients');
    expect(state).toHaveProperty('constructorBurger');
    expect(state).toHaveProperty('order');
    expect(state).toHaveProperty('user');
    expect(state).toHaveProperty('feed');
  });

  it('инициализирует срезы теми же начальными стейтами, что и их редьюсеры', () => {
    const initAction = { type: '@@INIT' };

    const rootState = rootReducer(undefined, initAction);

    expect(rootState.ingredients).toEqual(
      ingredientsReducer(undefined, initAction)
    );
    expect(rootState.constructorBurger).toEqual(
      constructorReducer(undefined, initAction)
    );
    expect(rootState.order).toEqual(orderReducer(undefined, initAction));
    expect(rootState.user).toEqual(userReducer(undefined, initAction));
    expect(rootState.feed).toEqual(feedReducer(undefined, initAction));
  });
});
