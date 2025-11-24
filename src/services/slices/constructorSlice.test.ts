import constructorReducer, {
  addIngredient,
  removeIngredient,
  moveIngredient
} from './constructorSlice';

type ConstructorState = ReturnType<typeof constructorReducer>;

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
  it('добавляет ингредиент в конструктор', () => {
    const state: ConstructorState = constructorReducer(
      undefined,
      addIngredient(baseIngredient)
    );

    expect(state.ingredients).toHaveLength(1);
    expect(state.ingredients[0]._id).toBe(baseIngredient._id);
    expect(state.ingredients[0].id).toBeDefined();
  });

  it('удаляет ингредиент по id', () => {
    const initialState: ConstructorState = {
      bun: null,
      ingredients: [
        { ...baseIngredient, id: 'first' },
        { ...baseIngredient, id: 'second' }
      ]
    };

    const state = constructorReducer(initialState, removeIngredient('first'));

    expect(state.ingredients).toHaveLength(1);
    expect(state.ingredients[0].id).toBe('second');
  });

  it('меняет порядок ингредиентов в списке начинки', () => {
    const initialState: ConstructorState = {
      bun: null,
      ingredients: [
        { ...baseIngredient, id: 'first' },
        { ...baseIngredient, id: 'second' },
        { ...baseIngredient, id: 'third' }
      ]
    };

    const state = constructorReducer(
      initialState,
      moveIngredient({ from: 0, to: 2 })
    );

    const idsOrder = state.ingredients.map((item) => item.id);
    expect(idsOrder).toEqual(['second', 'third', 'first']);
  });
  it('не меняет состояние при удалении ингредиента из пустого конструктора', () => {
    // начальное состояние редьюсера
    const initialState: ConstructorState = constructorReducer(undefined, {
      type: '@@INIT'
    });

    const state = constructorReducer(
      initialState,
      removeIngredient('non-existent-id')
    );

    expect(state).toEqual(initialState);
  });

  it(
    'не изменяет порядок ингредиентов при попытке ' +
      'перемещения с некорректными индексами',
    () => {
      const initialState: ConstructorState = {
        bun: null,
        ingredients: [
          { ...baseIngredient, id: 'first' },
          { ...baseIngredient, id: 'second' },
          { ...baseIngredient, id: 'third' }
        ]
      };

      const state = constructorReducer(
        initialState,
        // заведомо некорректный индекс from
        moveIngredient({ from: 10, to: 0 })
      );

      expect(state).toEqual(initialState);
    }
  );
});
