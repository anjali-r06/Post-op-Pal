import { useAuth } from '../../context/AuthContext';
import { Button } from '../../components/common/Button';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/common/Card';

const AdminDashboard = () => {
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">PostOpPal Admin Dashboard</h1>
          <Button onClick={logout} variant="outline">Logout</Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Welcome, {user?.name}!</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-lg mb-4">You are logged in as an administrator.</p>
            <p>This is a simplified admin dashboard. The full dashboard will be implemented here.</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminDashboard;