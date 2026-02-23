import LibraryCrudPage from '@components/libraries/LibraryCrudPage';
import { crudApi } from '@services/api';

export default function StoresPage() {
  return <LibraryCrudPage title="Stores" api={crudApi.stores} queryKey="stores" apiPath="stores" />;
}
