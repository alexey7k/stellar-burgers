import { FC } from 'react';
import { useParams } from 'react-router-dom';
import { useSelector } from '../../services/store';
import { IngredientDetailsUI } from '../../ui';
import { TIngredient } from '@utils-types';

type RouteParams = {
  id?: string;
};

export const IngredientDetails: FC = () => {
  const { id } = useParams<RouteParams>();

  const ingredient = useSelector((state) => {
    // Слайс ингредиентов может называться по-разному,
    // поэтому аккуратно достаём список через any.
    const slice: any = (state as any).ingredients;

    const list: TIngredient[] =
      slice?.data || slice?.items || slice?.ingredients || [];

    if (!id) return null;

    return list.find((item) => item._id === id) ?? null;
  });

  // Весь рендер отдаём на UI-компонент, туда всегда передаём
  // либо ингредиент, либо null — внутри UI уже есть защита.
  return <IngredientDetailsUI ingredient={ingredient} />;
};

export default IngredientDetails;
