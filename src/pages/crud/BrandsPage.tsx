import LibraryCrudPage from '@components/libraries/LibraryCrudPage';
import { crudApi } from '@services/api';

export default function BrandsPage() {
  return <LibraryCrudPage title="Brands" api={crudApi.brands} queryKey="brands" apiPath="brands" />;
}
