import LibraryCrudPage from '@components/libraries/LibraryCrudPage';
import { crudApi } from '@services/api';

export default function DeliveryZonesPage() {
  return <LibraryCrudPage title="Delivery Zones" api={crudApi.deliveryZones} queryKey="delivery-zones" fieldName="zone_name" apiPath="delivery-zones" />;
}
