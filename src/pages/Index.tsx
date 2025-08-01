import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Navigate } from "react-router-dom";

const Index = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="max-w-4xl mx-auto text-center space-y-8">
        <div className="space-y-4">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
            Tharikai
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Connecting weavers, buyers, and societies in a comprehensive saree marketplace platform
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
          <Card>
            <CardHeader>
              <CardTitle>For Weavers</CardTitle>
              <CardDescription>
                Track your earnings, manage orders, and access government schemes
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="text-sm space-y-2 text-muted-foreground">
                <li>• Production tracking</li>
                <li>• Earnings dashboard</li>
                <li>• Government scheme applications</li>
                <li>• Recognition system</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>For Buyers</CardTitle>
              <CardDescription>
                Browse and purchase authentic handwoven sarees
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="text-sm space-y-2 text-muted-foreground">
                <li>• Advanced filtering</li>
                <li>• Secure payments</li>
                <li>• Order tracking</li>
                <li>• Direct from weavers</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>For Society</CardTitle>
              <CardDescription>
                Manage the entire ecosystem from weavers to sales
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="text-sm space-y-2 text-muted-foreground">
                <li>• Hierarchical management</li>
                <li>• Progress monitoring</li>
                <li>• Communication tools</li>
                <li>• Scheme administration</li>
              </ul>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-4">
          <Button size="lg" asChild>
            <a href="/auth">Get Started</a>
          </Button>
          <p className="text-sm text-muted-foreground">
            Join the platform that's revolutionizing the handloom industry
          </p>
        </div>
      </div>
    </div>
  );
};

export default Index;
