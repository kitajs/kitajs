import { Layout } from '../../components/layout';
import { userDatabase } from '../../database';

export function get() {
  const users = Array.from(userDatabase.values());

  return (
    <Layout>
      {users.map((u) => (
        <div>
          <div safe>{u.name}</div>
          <div safe>{new Date(u.createdAt).toLocaleString()}</div>
          <div safe>{u.id}</div>
        </div>
      ))}
    </Layout>
  );
}
