import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FileText, Lock, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { authApi } from "@/services/api";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username || !password) {
      toast({ title: "Please fill in all fields", variant: "destructive" });
      return;
    }
    setLoading(true);
    try {
      const res = await authApi.login({ username, password });
      localStorage.setItem("user", JSON.stringify(res.user));
      navigate("/dashboard");
    } catch {
      toast({ title: "Login failed", description: "Check your credentials or server connection.", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  // Demo login for when backend isn't running
  const handleDemoLogin = () => {
    const demoUser = { id: 1, username: "demo", fullName: "Demo User", email: "demo@example.com" };
    localStorage.setItem("user", JSON.stringify(demoUser));
    navigate("/dashboard");
  };

  return (
    <div className="min-h-screen flex">
      {/* Left panel */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-hero items-center justify-center p-12">
        <div className="max-w-md text-center animate-fade-in">
          <div className="w-20 h-20 rounded-2xl bg-accent/20 flex items-center justify-center mx-auto mb-8">
            <FileText className="w-10 h-10 text-accent" />
          </div>
          <h1 className="text-4xl font-display font-bold text-primary-foreground mb-4">
            Document Manager
          </h1>
          <p className="text-primary-foreground/70 text-lg leading-relaxed">
            Securely store, organize, and access all your important documents offline. Your data stays on your device.
          </p>
        </div>
      </div>

      {/* Right panel */}
      <div className="flex-1 flex items-center justify-center p-6">
        <Card className="w-full max-w-md shadow-card border-0 animate-fade-in">
          <CardContent className="p-8">
            <div className="lg:hidden flex items-center gap-3 mb-8">
              <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center">
                <FileText className="w-5 h-5 text-primary-foreground" />
              </div>
              <h2 className="text-xl font-display font-bold text-foreground">DocManager</h2>
            </div>

            <h2 className="text-2xl font-display font-bold text-foreground mb-1">Welcome back</h2>
            <p className="text-muted-foreground mb-8">Sign in to manage your documents</p>

            <form onSubmit={handleLogin} className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="username">Username</Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="username"
                    placeholder="Enter username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="password"
                    type="password"
                    placeholder="Enter password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              <Button type="submit" className="w-full h-11" disabled={loading}>
                {loading ? "Signing in..." : "Sign In"}
              </Button>
            </form>

            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-border" />
              </div>
              <div className="relative flex justify-center text-xs">
                <span className="bg-card px-3 text-muted-foreground">or</span>
              </div>
            </div>

            <Button variant="outline" className="w-full" onClick={handleDemoLogin}>
              Continue with Demo Account
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Login;
