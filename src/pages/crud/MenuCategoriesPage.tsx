import LibraryCrudPage from '@components/libraries/LibraryCrudPage';
import { crudApi } from '@services/api';

export default function MenuCategoriesPage() {
  return <LibraryCrudPage title="Menu Categories" api={crudApi.menuCategories} queryKey="menu-categories" apiPath="menu-categories" />;
}
