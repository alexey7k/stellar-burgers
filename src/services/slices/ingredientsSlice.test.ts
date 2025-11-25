import ingredientsReducer, { fetchIngredients } from './ingredientsSlice';

const mockIngredients = [
  {
    _id: '1',
    name: 'Тестовая булка',
    type: 'bun' as const,
    proteins: 10,
    fat: 20,
    carbohydrates: 30,
    calories: 40,
    price: 100,
    image: 'image.png',
    image_mobile: 'image-mobile.png',
    image_large: 'image-large.png',
    __v: 0
  },
  {
    _id: '2',
    name: 'Тестовая начинка',
    type: 'main' as const,
    proteins: 5,
    fat: 10,
    carbohydrates: 15,
    calories: 20,
    price: 50,
    image: 'image2.png',
    image_mobile: 'image2-mobile.png',
    image_large: 'image2-large.png',
    __v: 0
  }
];

describe('ingredientsSlice reducer', () => {
  it('ставит loading в true при fetchIngredients.pending', () => {
    const state = ingredientsReducer(undefined, {
      type: fetchIngredients.pending.type
    });

    expect(state.loading).toBe(true);
    expect(state.error).toBeUndefined();
  });

  it('заполняет items и сбрасывает loading при fetchIngredients.fulfilled', () => {
    const loadingState = ingredientsReducer(undefined, {
      type: fetchIngredients.pending.type
    });

    const state = ingredientsReducer(loadingState, {
      type: fetchIngredients.fulfilled.type,
      payload: mockIngredients
    });

    expect(state.loading).toBe(false);
    expect(state.items).toEqual(mockIngredients);
    expect(state.error).toBeUndefined();
  });

  it('сохраняет ошибку и сбрасывает loading при fetchIngredients.rejected', () => {
    const loadingState = ingredientsReducer(undefined, {
      type: fetchIngredients.pending.type
    });

    const errorMessage = 'Failed to load ingredients';

    const state = ingredientsReducer(loadingState, {
      type: fetchIngredients.rejected.type,
      error: { message: errorMessage }
    });

    expect(state.loading).toBe(false);
    expect(state.error).toBe(errorMessage);
  });
});
