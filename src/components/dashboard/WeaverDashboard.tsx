import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

const WeaverDashboard = () => {
  const { user, signOut } = useAuth();
  const [metrics, setMetrics] = useState<any>(null);
  const [orders, setOrders] = useState<any[]>([]);
  const [schemes, setSchemes] = useState<any[]>([]);

  useEffect(() => {
    fetchWeaverData();
  }, [user]);

  const fetchWeaverData = async () => {
    if (!user) return;

    // Fetch weaver metrics
    const { data: metricsData } = await supabase
      .from('weaver_metrics')
      .select('*')
      .eq('weaver_id', user.id)
      .order('year', { ascending: false })
      .order('month', { ascending: false })
      .limit(1)
      .single();

    setMetrics(metricsData);

    // Fetch orders for weaver's sarees
    const { data: ordersData } = await supabase
      .from('orders')
      .select(`
        *,
        sarees (
          title,
          price,
          variety,
          material,
          color
        )
      `)
      .eq('sarees.weaver_id', user.id)
      .order('created_at', { ascending: false });

    setOrders(ordersData || []);

    // Fetch available schemes
    const { data: schemesData } = await supabase
      .from('government_schemes')
      .select('*')
      .eq('is_active', true)
      .order('created_at', { ascending: false });

    setSchemes(schemesData || []);
  };

  const handleSchemeApplication = async (schemeId: string) => {
    const { error } = await supabase
      .from('scheme_applications')
      .insert({
        weaver_id: user?.id,
        scheme_id: schemeId,
        status: 'submitted',
        submitted_at: new Date().toISOString()
      });

    if (error) {
      toast({
        title: "Error",
        description: "Failed to submit application",
        variant: "destructive"
      });
    } else {
      toast({
        title: "Success",
        description: "Application submitted successfully!"
      });
    }
  };

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Weaver Dashboard</h1>
        <Button onClick={signOut} variant="outline">Sign Out</Button>
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="orders">Orders</TabsTrigger>
          <TabsTrigger value="schemes">Government Schemes</TabsTrigger>
          <TabsTrigger value="products">My Sarees</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Monthly Earnings</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  ₹{metrics?.total_earnings || 0}
                </div>
                <p className="text-muted-foreground">This month</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Orders Fulfilled</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {metrics?.orders_fulfilled || 0}
                </div>
                <p className="text-muted-foreground">This month</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Recognition</CardTitle>
              </CardHeader>
              <CardContent>
                <Badge variant="secondary">Active Weaver</Badge>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="orders" className="space-y-4">
          {orders.map((order) => (
            <Card key={order.id}>
              <CardHeader>
                <CardTitle className="flex justify-between">
                  Order #{order.id.slice(0, 8)}
                  <Badge variant={
                    order.status === 'delivered' ? 'default' : 
                    order.status === 'in_progress' ? 'secondary' : 'outline'
                  }>
                    {order.status}
                  </Badge>
                </CardTitle>
                <CardDescription>
                  {order.sarees?.title} • ₹{order.total_amount}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  {order.sarees?.variety} • {order.sarees?.material} • {order.sarees?.color}
                </p>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="schemes" className="space-y-4">
          {schemes.map((scheme) => (
            <Card key={scheme.id}>
              <CardHeader>
                <CardTitle>{scheme.title}</CardTitle>
                <CardDescription>{scheme.description}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-semibold">Eligibility:</h4>
                  <p className="text-sm text-muted-foreground">{scheme.eligibility_criteria}</p>
                </div>
                <div>
                  <h4 className="font-semibold">Benefits:</h4>
                  <p className="text-sm text-muted-foreground">{scheme.benefits}</p>
                </div>
                <Button onClick={() => handleSchemeApplication(scheme.id)}>
                  Apply for Scheme
                </Button>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="products">
          <Card>
            <CardHeader>
              <CardTitle>My Sarees</CardTitle>
              <CardDescription>Manage your saree listings</CardDescription>
            </CardHeader>
            <CardContent>
              <Button>Add New Saree</Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default WeaverDashboard;