import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { TIngredient, TConstructorIngredient } from '@utils-types';
import { v4 as uuidv4 } from 'uuid';

type TConstructorState = {
  bun: TIngredient | null;
  ingredients: TConstructorIngredient[]; // список выбранных ингредиентов в конструкторе
};

// Начальное состояние: булка отсутствует, список ингредиентов пустой
const initialState: TConstructorState = {
  bun: null,
  ingredients: [] // инициализируем пустой массив, чтобы push работал корректно
};

const constructorSlice = createSlice({
  name: 'constructor',
  initialState,
  reducers: {
    // Добавление булки – заменяем текущую булку на новую
    addBun: (state, action: PayloadAction<TIngredient>) => {
      state.bun = action.payload;
    },
    // Добавление начинки/соуса – добавляем ингредиент в список с уникальным id
    addIngredient: (state, action: PayloadAction<TIngredient>) => {
      const newIngredient: TConstructorIngredient = {
        ...action.payload,
        id: uuidv4() // генерируем уникальный id для ингредиента в конструкторе
      };
      state.ingredients.push(newIngredient); // теперь state.ingredients точно массив, ошибка устранена
    },
    // Удаление ингредиента по его уникальному id
    removeIngredient: (state, action: PayloadAction<string>) => {
      state.ingredients = state.ingredients.filter(
        (item) => item.id !== action.payload
      );
    },
    // Перемещение ингредиента внутри списка (перетаскивание)
    // moveIngredient: (
    //   state,
    //   action: PayloadAction<{ from: number; to: number }>
    // ) => {
    //   const { from, to } = action.payload;
    //   const ingredients = [...state.ingredients];
    //   const [movedItem] = ingredients.splice(from, 1);
    //   ingredients.splice(to, 0, movedItem);
    //   state.ingredients = ingredients;
    // },
    moveIngredient: (
      state,
      action: PayloadAction<{ from: number; to: number }>
    ) => {
      const { from, to } = action.payload;
      const ingredients = [...state.ingredients];

      // Защита от некорректных индексов: если что-то не так — выходим,
      // не меняя состояние
      if (
        from < 0 ||
        from >= ingredients.length ||
        to < 0 ||
        to >= ingredients.length
      ) {
        return;
      }

      const [movedItem] = ingredients.splice(from, 1);
      ingredients.splice(to, 0, movedItem);
      state.ingredients = ingredients;
    },
    // Очистка конструктора (удаляем булку и все ингредиенты)
    clearConstructor: (state) => {
      state.bun = null;
      state.ingredients = [];
    }
  }
});

// Экспортируем генераторы экшенов и редьюсер
export const {
  addBun,
  addIngredient,
  removeIngredient,
  moveIngredient,
  clearConstructor
} = constructorSlice.actions;
export default constructorSlice.reducer;
