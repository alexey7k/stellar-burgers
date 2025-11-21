import constructorReducer, {
  addIngredient,
  removeIngredient,
  moveIngredient
} from './constructorSlice';

const baseIngredient = {
  _id: '1',
  name: 'Тестовый ингредиент',
  type: 'main' as const,
  proteins: 10,
  fat: 20,
  carbohydrates: 30,
  calories: 40,
  price: 100,
  image: 'image.png',
  image_mobile: 'image-mobile.png',
  image_large: 'image-large.png',
  __v: 0
};

describe('constructorSlice reducer', () => {
  it('обрабатывает добавление ингредиента (addIngredient)', () => {
    const action = addIngredient(baseIngredient);

    const state = constructorReducer(undefined, action);

    expect(state.ingredients).toHaveLength(1);
    expect(state.ingredients[0]._id).toBe(baseIngredient._id);
    // в конструкторе ингредиент получает уникальный id
    expect(state.ingredients[0].id).toBeDefined();
  });

  it('обрабатывает удаление ингредиента (removeIngredient)', () => {
    const initialState = {
      bun: null,
      ingredients: [
        { ...baseIngredient, id: 'first' },
        { ...baseIngredient, id: 'second' }
      ]
    };

    const action = removeIngredient('first');
    const state = constructorReducer(initialState as any, action);

    expect(state.ingredients).toHaveLength(1);
    expect(state.ingredients[0].id).toBe('second');
  });

  it('обрабатывает изменение порядка ингредиентов (moveIngredient)', () => {
    const initialState = {
      bun: null,
      ingredients: [
        { ...baseIngredient, id: 'first' },
        { ...baseIngredient, id: 'second' },
        { ...baseIngredient, id: 'third' }
      ]
    };

    const action = moveIngredient({ from: 0, to: 2 });
    const state = constructorReducer(initialState as any, action);

    const idsOrder = state.ingredients.map((item: any) => item.id);
    expect(idsOrder).toEqual(['second', 'third', 'first']);
  });
});
