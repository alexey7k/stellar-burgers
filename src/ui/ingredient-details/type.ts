import { TIngredient } from '@utils-types';

export type IngredientDetailsUIProps = {
  // В модалке / на странице ингредиент может ещё не быть загружен,
  // поэтому допускаем null и обрабатываем его внутри.
  ingredient: TIngredient | null;
};
