import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Home, Search } from "lucide-react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-subtle">
      <Card className="text-center p-8 bg-gradient-card shadow-molecular max-w-md">
        <div className="mb-6">
          <Search className="h-16 w-16 mx-auto text-primary opacity-50 mb-4" />
          <h1 className="text-4xl font-bold mb-2 text-foreground">404</h1>
          <p className="text-xl text-muted-foreground mb-4">Research Not Found</p>
          <p className="text-sm text-muted-foreground">
            The molecular pathway you're looking for doesn't exist in our knowledge graph.
          </p>
        </div>
        <Button 
          asChild 
          className="bg-gradient-primary hover:shadow-glow transition-bounce"
        >
          <a href="/">
            <Home className="h-4 w-4 mr-2" />
            Return to Discovery Lab
          </a>
        </Button>
      </Card>
    </div>
  );
};

export default NotFound;
