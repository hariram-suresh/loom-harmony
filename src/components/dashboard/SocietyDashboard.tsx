import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';

const SocietyDashboard = () => {
  const { user, userRole, signOut } = useAuth();
  const [weavers, setWeavers] = useState<any[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  const [schemeApplications, setSchemeApplications] = useState<any[]>([]);
  const [messages, setMessages] = useState<any[]>([]);

  useEffect(() => {
    fetchDashboardData();
  }, [user]);

  const fetchDashboardData = async () => {
    if (!user) return;

    // Fetch weavers under this society member's hierarchy
    const { data: weaversData } = await supabase
      .from('profiles')
      .select('*')
      .eq('role', 'weaver')
      .order('created_at', { ascending: false });

    setWeavers(weaversData || []);

    // Fetch recent orders
    const { data: ordersData } = await supabase
      .from('orders')
      .select(`
        *,
        sarees (
          title,
          price,
          profiles (
            full_name
          )
        ),
        profiles (
          full_name
        )
      `)
      .order('created_at', { ascending: false })
      .limit(10);

    setOrders(ordersData || []);

    // Fetch scheme applications for review
    const { data: applicationsData } = await supabase
      .from('scheme_applications')
      .select(`
        *,
        profiles (
          full_name
        ),
        government_schemes (
          title
        )
      `)
      .in('status', ['submitted', 'under_review'])
      .order('submitted_at', { ascending: false });

    setSchemeApplications(applicationsData || []);

    // Fetch messages
    const { data: messagesData } = await supabase
      .from('messages')
      .select(`
        *,
        sender:profiles!messages_sender_id_fkey (
          full_name
        ),
        recipient:profiles!messages_recipient_id_fkey (
          full_name
        )
      `)
      .or(`sender_id.eq.${user.id},recipient_id.eq.${user.id}`)
      .order('created_at', { ascending: false })
      .limit(10);

    setMessages(messagesData || []);
  };

  const handleSchemeReview = async (applicationId: string, status: 'approved' | 'rejected', notes: string = '') => {
    const { error } = await supabase
      .from('scheme_applications')
      .update({
        status,
        reviewed_by: user?.id,
        review_notes: notes,
        reviewed_at: new Date().toISOString()
      })
      .eq('id', applicationId);

    if (!error) {
      fetchDashboardData();
    }
  };

  const getRoleTitle = () => {
    switch (userRole) {
      case 'handloom_head':
        return 'Handloom Head Dashboard';
      case 'district_head':
        return 'District Head Dashboard';
      case 'department_employee':
        return 'Department Employee Dashboard';
      case 'society_admin':
        return 'Society Admin Dashboard';
      default:
        return 'Society Dashboard';
    }
  };

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">{getRoleTitle()}</h1>
        <Button onClick={signOut} variant="outline">Sign Out</Button>
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="weavers">Weavers</TabsTrigger>
          <TabsTrigger value="orders">Orders</TabsTrigger>
          <TabsTrigger value="schemes">Scheme Applications</TabsTrigger>
          <TabsTrigger value="messages">Messages</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Total Weavers</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{weavers.length}</div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Recent Orders</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{orders.length}</div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Pending Applications</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{schemeApplications.length}</div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Messages</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{messages.length}</div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="weavers" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {weavers.map((weaver) => (
              <Card key={weaver.id}>
                <CardHeader>
                  <CardTitle>{weaver.full_name}</CardTitle>
                  <CardDescription>{weaver.email}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <p><span className="font-medium">State:</span> {weaver.state || 'Not set'}</p>
                    <p><span className="font-medium">District:</span> {weaver.district || 'Not set'}</p>
                    <p><span className="font-medium">Society:</span> {weaver.society_name || 'Not set'}</p>
                    <Badge variant={weaver.is_active ? 'default' : 'secondary'}>
                      {weaver.is_active ? 'Active' : 'Inactive'}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            ))}
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
                <div className="space-y-1">
                  <p><span className="font-medium">Weaver:</span> {order.sarees?.profiles?.full_name}</p>
                  <p><span className="font-medium">Buyer:</span> {order.profiles?.full_name}</p>
                  <p><span className="font-medium">Date:</span> {new Date(order.created_at).toLocaleDateString()}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="schemes" className="space-y-4">
          {schemeApplications.map((application) => (
            <Card key={application.id}>
              <CardHeader>
                <CardTitle>{application.government_schemes?.title}</CardTitle>
                <CardDescription>
                  Application by {application.profiles?.full_name}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-2">
                  <Badge variant="outline">{application.status}</Badge>
                  <span className="text-sm text-muted-foreground">
                    Submitted: {new Date(application.submitted_at).toLocaleDateString()}
                  </span>
                </div>
                
                {userRole === 'district_head' || userRole === 'handloom_head' ? (
                  <div className="flex gap-2">
                    <Button 
                      size="sm"
                      onClick={() => handleSchemeReview(application.id, 'approved')}
                    >
                      Approve
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => handleSchemeReview(application.id, 'rejected')}
                    >
                      Reject
                    </Button>
                  </div>
                ) : null}
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="messages" className="space-y-4">
          {messages.map((message) => (
            <Card key={message.id}>
              <CardHeader>
                <CardTitle className="text-lg">{message.subject}</CardTitle>
                <CardDescription>
                  From: {message.sender?.full_name} • To: {message.recipient?.full_name}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm">{message.content}</p>
                <p className="text-xs text-muted-foreground mt-2">
                  {new Date(message.created_at).toLocaleDateString()}
                </p>
              </CardContent>
            </Card>
          ))}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SocietyDashboard;