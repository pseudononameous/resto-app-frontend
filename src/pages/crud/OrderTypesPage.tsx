import LibraryCrudPage from '@components/libraries/LibraryCrudPage';
import { crudApi } from '@services/api';

export default function OrderTypesPage() {
  return <LibraryCrudPage title="Order Types" api={crudApi.orderTypes} queryKey="order-types" fieldName="type_name" apiPath="order-types" />;
}
