import LibraryCrudPage from '@components/libraries/LibraryCrudPage';
import { crudApi } from '@services/api';

export default function ComboMealsPage() {
  return <LibraryCrudPage title="Combo Meals" api={crudApi.comboMeals} queryKey="combo-meals" apiPath="combo-meals" />;
}
