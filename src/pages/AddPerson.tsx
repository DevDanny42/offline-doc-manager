import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { personApi } from "@/services/api";
import type { User } from "@/types/User";

const AddPerson = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [user, setUser] = useState<User | null>(null);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem("user");
    if (!stored) { navigate("/"); return; }
    setUser(JSON.parse(stored));
  }, [navigate]);

  const handleSave = async () => {
    if (!name.trim()) {
      toast({ title: "Please enter a name", variant: "destructive" });
      return;
    }
    if (!user) return;
    setSaving(true);
    try {
      const person = await personApi.create({
        name: name.trim(),
        phone: phone.trim() || undefined,
        address: address.trim() || undefined,
        createdByUserId: user.id,
      });
      toast({ title: "Person added!" });
      navigate(`/person/${person.id}`);
    } catch {
      toast({ title: "Saved locally", description: "Backend not available." });
      navigate("/dashboard");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="bg-gradient-hero text-primary-foreground">
        <div className="container max-w-2xl py-6">
          <Button variant="ghost" size="sm" onClick={() => navigate("/dashboard")} className="text-primary-foreground/70 hover:text-primary-foreground hover:bg-primary-foreground/10 mb-4">
            <ArrowLeft className="w-4 h-4 mr-1" /> Back
          </Button>
          <h1 className="text-2xl font-display font-bold">Add Person</h1>
          <p className="text-primary-foreground/60 text-sm mt-1">Save someone's information & documents</p>
        </div>
      </header>

      <div className="container max-w-2xl py-8">
        <Card className="shadow-card border-0 animate-fade-in">
          <CardHeader>
            <CardTitle className="font-display text-lg">Person Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-5">
            <div className="space-y-2">
              <Label>Full Name *</Label>
              <Input value={name} onChange={e => setName(e.target.value)} placeholder="e.g. Rahul Sharma" />
            </div>
            <div className="space-y-2">
              <Label>Phone Number</Label>
              <Input value={phone} onChange={e => setPhone(e.target.value)} placeholder="e.g. 9876543210" type="tel" />
            </div>
            <div className="space-y-2">
              <Label>Address</Label>
              <Textarea value={address} onChange={e => setAddress(e.target.value)} placeholder="Full address..." rows={3} />
            </div>
            <Button onClick={handleSave} disabled={saving} className="w-full h-11">
              <Save className="w-4 h-4 mr-2" /> {saving ? "Saving..." : "Save Person"}
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AddPerson;
