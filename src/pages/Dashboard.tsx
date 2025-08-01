import { useAuth } from '@/hooks/useAuth';
import { Navigate } from 'react-router-dom';
import WeaverDashboard from '@/components/dashboard/WeaverDashboard';
import BuyerDashboard from '@/components/dashboard/BuyerDashboard';
import SocietyDashboard from '@/components/dashboard/SocietyDashboard';

const Dashboard = () => {
  const { user, userRole, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  const renderDashboard = () => {
    switch (userRole) {
      case 'weaver':
        return <WeaverDashboard />;
      case 'buyer':
        return <BuyerDashboard />;
      case 'society_admin':
      case 'department_employee':
      case 'district_head':
      case 'handloom_head':
        return <SocietyDashboard />;
      default:
        return <BuyerDashboard />;
    }
  };

  return <div className="min-h-screen bg-background">{renderDashboard()}</div>;
};

export default Dashboard;