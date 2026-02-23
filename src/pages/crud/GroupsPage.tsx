import LibraryCrudPage from '@components/libraries/LibraryCrudPage';
import { crudApi } from '@services/api';

export default function GroupsPage() {
  return <LibraryCrudPage title="Groups" api={crudApi.groups} queryKey="groups" fieldName="group_name" apiPath="groups" />;
}
