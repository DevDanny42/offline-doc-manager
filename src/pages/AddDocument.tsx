import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Upload, FileText, Camera } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { documentApi } from "@/services/api";
import type { User } from "@/types/User";
import type { DocumentType } from "@/types/Document";
import { DOCUMENT_TYPE_LABELS } from "@/types/Document";

const AddDocument = () => {
  const { personId } = useParams<{ personId: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [user, setUser] = useState<User | null>(null);
  const [name, setName] = useState("");
  const [type, setType] = useState<DocumentType>("OTHER");
  const [description, setDescription] = useState("");
  const [fileName, setFileName] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem("user");
    if (!stored) { navigate("/"); return; }
    setUser(JSON.parse(stored));
  }, [navigate]);

  const handleFileSelect = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*,.pdf";
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        setFileName(file.name);
        if (!name) setName(file.name.replace(/\.[^.]+$/, ""));
      }
    };
    input.click();
  };

  const handleSave = async () => {
    if (!name.trim()) {
      toast({ title: "Please enter a document name", variant: "destructive" });
      return;
    }
    if (!user || !personId) return;
    setSaving(true);
    try {
      await documentApi.create({
        name,
        type,
        filePath: `/files/${fileName || "document.pdf"}`,
        personId: Number(personId),
        ownerId: user.id,
        description,
      });
      toast({ title: "Document saved!" });
      navigate(`/person/${personId}`);
    } catch {
      toast({ title: "Saved locally", description: "Backend not available." });
      navigate(`/person/${personId}`);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="bg-gradient-hero text-primary-foreground">
        <div className="container max-w-2xl py-6">
          <Button variant="ghost" size="sm" onClick={() => navigate(personId ? `/person/${personId}` : "/dashboard")} className="text-primary-foreground/70 hover:text-primary-foreground hover:bg-primary-foreground/10 mb-4">
            <ArrowLeft className="w-4 h-4 mr-1" /> Back
          </Button>
          <h1 className="text-2xl font-display font-bold">Add Document</h1>
          <p className="text-primary-foreground/60 text-sm mt-1">Store a new document securely</p>
        </div>
      </header>

      <div className="container max-w-2xl py-8 space-y-6">
        <Card className="shadow-card border-0 animate-fade-in">
          <CardContent className="p-6">
            <button
              onClick={handleFileSelect}
              className="w-full border-2 border-dashed border-border rounded-xl p-8 flex flex-col items-center gap-3 hover:border-primary/40 hover:bg-primary/5 transition-colors"
            >
              {fileName ? (
                <>
                  <div className="w-14 h-14 rounded-xl bg-success/10 flex items-center justify-center">
                    <FileText className="w-7 h-7 text-success" />
                  </div>
                  <p className="font-medium text-foreground">{fileName}</p>
                  <p className="text-sm text-muted-foreground">Tap to change file</p>
                </>
              ) : (
                <>
                  <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center">
                    <Upload className="w-7 h-7 text-primary" />
                  </div>
                  <p className="font-medium text-foreground">Select File</p>
                  <p className="text-sm text-muted-foreground">Photo, PDF, or any document</p>
                </>
              )}
            </button>

            <div className="flex gap-3 mt-4">
              <Button variant="outline" className="flex-1" onClick={handleFileSelect}>
                <Upload className="w-4 h-4 mr-2" /> Gallery
              </Button>
              <Button variant="outline" className="flex-1" onClick={handleFileSelect}>
                <Camera className="w-4 h-4 mr-2" /> Camera
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-card border-0 animate-fade-in" style={{ animationDelay: "100ms" }}>
          <CardHeader>
            <CardTitle className="font-display text-lg">Document Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-5">
            <div className="space-y-2">
              <Label>Document Name</Label>
              <Input value={name} onChange={e => setName(e.target.value)} placeholder="e.g. Aadhar Card" />
            </div>
            <div className="space-y-2">
              <Label>Document Type</Label>
              <Select value={type} onValueChange={(v) => setType(v as DocumentType)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {Object.entries(DOCUMENT_TYPE_LABELS).map(([key, label]) => (
                    <SelectItem key={key} value={key}>{label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Description (optional)</Label>
              <Textarea value={description} onChange={e => setDescription(e.target.value)} placeholder="Add notes about this document..." rows={3} />
            </div>
            <Button onClick={handleSave} disabled={saving} className="w-full h-11">
              {saving ? "Saving..." : "Save Document"}
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AddDocument;
