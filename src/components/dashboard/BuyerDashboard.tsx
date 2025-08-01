import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

const BuyerDashboard = () => {
  const { user, signOut } = useAuth();
  const [sarees, setSarees] = useState<any[]>([]);
  const [filteredSarees, setFilteredSarees] = useState<any[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  const [filters, setFilters] = useState({
    variety: '',
    material: '',
    color: '',
    design: ''
  });

  useEffect(() => {
    fetchSarees();
    fetchOrders();
  }, [user]);

  useEffect(() => {
    applyFilters();
  }, [sarees, filters]);

  const fetchSarees = async () => {
    const { data } = await supabase
      .from('sarees')
      .select(`
        *,
        profiles (
          full_name,
          society_name
        )
      `)
      .eq('is_available', true)
      .order('created_at', { ascending: false });

    setSarees(data || []);
  };

  const fetchOrders = async () => {
    if (!user) return;

    const { data } = await supabase
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
      .eq('buyer_id', user.id)
      .order('created_at', { ascending: false });

    setOrders(data || []);
  };

  const applyFilters = () => {
    let filtered = sarees;

    if (filters.variety) {
      filtered = filtered.filter(saree => saree.variety === filters.variety);
    }
    if (filters.material) {
      filtered = filtered.filter(saree => saree.material === filters.material);
    }
    if (filters.color) {
      filtered = filtered.filter(saree => saree.color.toLowerCase().includes(filters.color.toLowerCase()));
    }
    if (filters.design) {
      filtered = filtered.filter(saree => saree.design.toLowerCase().includes(filters.design.toLowerCase()));
    }

    setFilteredSarees(filtered);
  };

  const handlePurchase = async (sareeId: string, price: number) => {
    if (!user) return;

    const { error } = await supabase
      .from('orders')
      .insert({
        buyer_id: user.id,
        saree_id: sareeId,
        total_amount: price,
        status: 'pending'
      });

    if (error) {
      toast({
        title: "Error",
        description: "Failed to place order",
        variant: "destructive"
      });
    } else {
      toast({
        title: "Success",
        description: "Order placed successfully!"
      });
      fetchOrders();
    }
  };

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Buyer Dashboard</h1>
        <Button onClick={signOut} variant="outline">Sign Out</Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Filters */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>Filters</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium">Variety</label>
              <Select value={filters.variety} onValueChange={(value) => setFilters(prev => ({ ...prev, variety: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="All varieties" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All varieties</SelectItem>
                  <SelectItem value="silk">Silk</SelectItem>
                  <SelectItem value="cotton">Cotton</SelectItem>
                  <SelectItem value="handloom">Handloom</SelectItem>
                  <SelectItem value="banarasi">Banarasi</SelectItem>
                  <SelectItem value="kanjivaram">Kanjivaram</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium">Material</label>
              <Select value={filters.material} onValueChange={(value) => setFilters(prev => ({ ...prev, material: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="All materials" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All materials</SelectItem>
                  <SelectItem value="pure_silk">Pure Silk</SelectItem>
                  <SelectItem value="cotton">Cotton</SelectItem>
                  <SelectItem value="silk_cotton">Silk Cotton</SelectItem>
                  <SelectItem value="synthetic">Synthetic</SelectItem>
                  <SelectItem value="linen">Linen</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium">Color</label>
              <Input
                placeholder="Search by color"
                value={filters.color}
                onChange={(e) => setFilters(prev => ({ ...prev, color: e.target.value }))}
              />
            </div>

            <div>
              <label className="text-sm font-medium">Design</label>
              <Input
                placeholder="Search by design"
                value={filters.design}
                onChange={(e) => setFilters(prev => ({ ...prev, design: e.target.value }))}
              />
            </div>

            <Button 
              variant="outline" 
              className="w-full"
              onClick={() => setFilters({ variety: '', material: '', color: '', design: '' })}
            >
              Clear Filters
            </Button>
          </CardContent>
        </Card>

        {/* Products */}
        <div className="lg:col-span-3 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {filteredSarees.map((saree) => (
              <Card key={saree.id}>
                <CardHeader>
                  <CardTitle className="text-lg">{saree.title}</CardTitle>
                  <CardDescription>{saree.description}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="secondary">{saree.variety}</Badge>
                    <Badge variant="outline">{saree.material}</Badge>
                  </div>
                  
                  <div className="space-y-1">
                    <p><span className="font-medium">Color:</span> {saree.color}</p>
                    <p><span className="font-medium">Design:</span> {saree.design}</p>
                    <p><span className="font-medium">Weaver:</span> {saree.profiles?.full_name}</p>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-2xl font-bold">₹{saree.price}</span>
                    <Button onClick={() => handlePurchase(saree.id, saree.price)}>
                      Buy Now
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Orders Section */}
          <Card>
            <CardHeader>
              <CardTitle>Your Orders</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {orders.map((order) => (
                  <div key={order.id} className="flex justify-between items-center p-4 border rounded-lg">
                    <div>
                      <h4 className="font-medium">{order.sarees?.title}</h4>
                      <p className="text-sm text-muted-foreground">₹{order.total_amount}</p>
                    </div>
                    <Badge variant={
                      order.status === 'delivered' ? 'default' : 
                      order.status === 'in_progress' ? 'secondary' : 'outline'
                    }>
                      {order.status}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default BuyerDashboard;