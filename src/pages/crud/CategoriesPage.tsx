import LibraryCrudPage from '@components/libraries/LibraryCrudPage';
import { crudApi } from '@services/api';

export default function CategoriesPage() {
  return <LibraryCrudPage title="Categories" api={crudApi.categories} queryKey="categories" apiPath="categories" />;
}
