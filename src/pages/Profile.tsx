import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Camera, Save, User as UserIcon, Mail, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useToast } from "@/hooks/use-toast";
import { userApi } from "@/services/api";
import type { User } from "@/types/User";

const Profile = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [user, setUser] = useState<User | null>(null);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem("user");
    if (!stored) { navigate("/"); return; }
    const u: User = JSON.parse(stored);
    setUser(u);
    setFullName(u.fullName);
    setEmail(u.email || "");
    setPhone(u.phone || "");
  }, [navigate]);

  const handleSave = async () => {
    if (!user) return;
    setSaving(true);
    try {
      const updated = await userApi.updateProfile(user.id, { fullName, email, phone });
      localStorage.setItem("user", JSON.stringify(updated));
      setUser(updated);
      toast({ title: "Profile updated successfully" });
    } catch {
      // Fallback: save locally
      const updated = { ...user, fullName, email, phone };
      localStorage.setItem("user", JSON.stringify(updated));
      setUser(updated);
      toast({ title: "Saved locally", description: "Backend not available — saved to local storage." });
    } finally {
      setSaving(false);
    }
  };

  const initials = fullName ? fullName.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2) : "U";

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-gradient-hero text-primary-foreground">
        <div className="container max-w-2xl py-6">
          <Button variant="ghost" size="sm" onClick={() => navigate("/dashboard")} className="text-primary-foreground/70 hover:text-primary-foreground hover:bg-primary-foreground/10 mb-4">
            <ArrowLeft className="w-4 h-4 mr-1" /> Back
          </Button>
          <div className="flex items-center gap-4">
            <div className="relative">
              <Avatar className="w-20 h-20 border-2 border-primary-foreground/20">
                <AvatarFallback className="bg-accent text-accent-foreground text-xl font-display font-bold">
                  {initials}
                </AvatarFallback>
              </Avatar>
              <button className="absolute -bottom-1 -right-1 w-8 h-8 rounded-full bg-accent text-accent-foreground flex items-center justify-center shadow-md">
                <Camera className="w-4 h-4" />
              </button>
            </div>
            <div>
              <h1 className="text-2xl font-display font-bold">{fullName || "Your Profile"}</h1>
              <p className="text-primary-foreground/60 text-sm">@{user?.username}</p>
            </div>
          </div>
        </div>
      </header>

      {/* Form */}
      <div className="container max-w-2xl py-8">
        <Card className="shadow-card border-0 animate-fade-in">
          <CardHeader>
            <CardTitle className="font-display">Personal Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-5">
            <div className="space-y-2">
              <Label>Full Name</Label>
              <div className="relative">
                <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input value={fullName} onChange={e => setFullName(e.target.value)} className="pl-10" placeholder="Your full name" />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input value={email} onChange={e => setEmail(e.target.value)} className="pl-10" placeholder="email@example.com" />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Phone</Label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input value={phone} onChange={e => setPhone(e.target.value)} className="pl-10" placeholder="+91 XXXXX XXXXX" />
              </div>
            </div>
            <Button onClick={handleSave} disabled={saving} className="w-full h-11">
              <Save className="w-4 h-4 mr-2" />
              {saving ? "Saving..." : "Save Changes"}
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Profile;
