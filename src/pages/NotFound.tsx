
import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Ghost } from "lucide-react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6 text-center">
      <div className="relative mb-8">
        <div className="absolute inset-0 bg-primary/20 blur-3xl rounded-full scale-150 animate-pulse" />
        <Ghost className="w-24 h-24 text-primary relative animate-bounce" />
      </div>
      
      <div className="space-y-2 mb-12">
        <h1 className="text-6xl font-black tracking-tighter">404</h1>
        <p className="text-xl font-bold uppercase tracking-widest text-muted-foreground/60">Page Lost in Space</p>
      </div>

      <div className="max-w-xs mx-auto space-y-6">
        <p className="text-sm text-muted-foreground leading-relaxed">
          Kowalski, status report. This page seems to have vanished from our records, sir.
        </p>
        
        <Link to="/">
          <Button className="rounded-full px-8 font-black uppercase tracking-widest text-xs h-12 shadow-xl shadow-primary/20">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Go Back Home
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
