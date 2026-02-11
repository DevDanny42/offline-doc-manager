import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Edit2, Save, Trash2, Share2, Printer, FileText, Calendar, Tag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";
import { documentApi } from "@/services/api";
import type { Document, DocumentType } from "@/types/Document";
import { DOCUMENT_TYPE_LABELS } from "@/types/Document";

// Demo fallback
const DEMO_DOC: Document = {
  id: 1, name: "Aadhar Card", type: "AADHAR", filePath: "/files/aadhar.jpg",
  ownerId: 1, description: "Personal Aadhar Card", createdAt: "2025-01-15T10:00:00Z",
};

const ViewDocument = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [doc, setDoc] = useState<Document | null>(null);
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState("");
  const [type, setType] = useState<DocumentType>("OTHER");
  const [description, setDescription] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchDoc = async () => {
      try {
        const d = await documentApi.getById(Number(id));
        setDoc(d);
        setName(d.name);
        setType(d.type);
        setDescription(d.description || "");
      } catch {
        setDoc(DEMO_DOC);
        setName(DEMO_DOC.name);
        setType(DEMO_DOC.type);
        setDescription(DEMO_DOC.description || "");
      }
    };
    fetchDoc();
  }, [id]);

  const handleSave = async () => {
    if (!doc) return;
    setSaving(true);
    try {
      const updated = await documentApi.update(doc.id, { name, type, description });
      setDoc(updated);
      toast({ title: "Document updated" });
    } catch {
      setDoc({ ...doc, name, type, description });
      toast({ title: "Updated locally" });
    } finally {
      setSaving(false);
      setEditing(false);
    }
  };

  const handleDelete = async () => {
    if (!doc) return;
    try {
      await documentApi.delete(doc.id);
    } catch { /* fallback */ }
    toast({ title: "Document deleted" });
    navigate("/dashboard");
  };

  const handleShare = () => {
    // In Android, this would call WebAppInterface.shareFile()
    toast({ title: "Share", description: "Share functionality requires Android native bridge." });
  };

  const handlePrint = () => {
    // In Android, this would call WebAppInterface.printFile()
    toast({ title: "Print", description: "Print functionality requires Android native bridge." });
  };

  if (!doc) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-12 h-12 bg-muted rounded-xl animate-pulse" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="bg-gradient-hero text-primary-foreground">
        <div className="container max-w-2xl py-6">
          <Button variant="ghost" size="sm" onClick={() => navigate("/dashboard")} className="text-primary-foreground/70 hover:text-primary-foreground hover:bg-primary-foreground/10 mb-4">
            <ArrowLeft className="w-4 h-4 mr-1" /> Back
          </Button>
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-2xl font-display font-bold">{doc.name}</h1>
              <Badge className="mt-2 bg-primary-foreground/15 text-primary-foreground border-0">
                {DOCUMENT_TYPE_LABELS[doc.type]}
              </Badge>
            </div>
            <div className="flex gap-1">
              <Button variant="ghost" size="icon" onClick={handleShare} className="text-primary-foreground/70 hover:text-primary-foreground hover:bg-primary-foreground/10">
                <Share2 className="w-5 h-5" />
              </Button>
              <Button variant="ghost" size="icon" onClick={handlePrint} className="text-primary-foreground/70 hover:text-primary-foreground hover:bg-primary-foreground/10">
                <Printer className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container max-w-2xl py-8 space-y-6">
        {/* Preview */}
        <Card className="shadow-card border-0 animate-fade-in overflow-hidden">
          <div className="aspect-[4/3] bg-muted flex items-center justify-center">
            <div className="text-center">
              <FileText className="w-16 h-16 text-muted-foreground/40 mx-auto mb-3" />
              <p className="text-sm text-muted-foreground">Document preview</p>
              <p className="text-xs text-muted-foreground/60 mt-1">{doc.filePath}</p>
            </div>
          </div>
        </Card>

        {/* Details */}
        <Card className="shadow-card border-0 animate-fade-in" style={{ animationDelay: "100ms" }}>
          <CardContent className="p-6">
            {editing ? (
              <div className="space-y-5">
                <div className="space-y-2">
                  <Label>Name</Label>
                  <Input value={name} onChange={e => setName(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label>Type</Label>
                  <Select value={type} onValueChange={v => setType(v as DocumentType)}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {Object.entries(DOCUMENT_TYPE_LABELS).map(([k, l]) => (
                        <SelectItem key={k} value={k}>{l}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Description</Label>
                  <Textarea value={description} onChange={e => setDescription(e.target.value)} rows={3} />
                </div>
                <div className="flex gap-3">
                  <Button onClick={handleSave} disabled={saving} className="flex-1">
                    <Save className="w-4 h-4 mr-2" /> {saving ? "Saving..." : "Save"}
                  </Button>
                  <Button variant="outline" onClick={() => setEditing(false)}>Cancel</Button>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <Tag className="w-4 h-4 text-muted-foreground" />
                  <div>
                    <p className="text-xs text-muted-foreground">Type</p>
                    <p className="font-medium text-foreground">{DOCUMENT_TYPE_LABELS[doc.type]}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Calendar className="w-4 h-4 text-muted-foreground" />
                  <div>
                    <p className="text-xs text-muted-foreground">Created</p>
                    <p className="font-medium text-foreground">{new Date(doc.createdAt).toLocaleDateString()}</p>
                  </div>
                </div>
                {doc.description && (
                  <div className="pt-2 border-t border-border">
                    <p className="text-sm text-muted-foreground">{doc.description}</p>
                  </div>
                )}
                <div className="flex gap-3 pt-2">
                  <Button variant="outline" onClick={() => setEditing(true)} className="flex-1">
                    <Edit2 className="w-4 h-4 mr-2" /> Edit
                  </Button>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="outline" className="text-destructive border-destructive/20 hover:bg-destructive/5">
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Delete document?</AlertDialogTitle>
                        <AlertDialogDescription>This will permanently remove "{doc.name}" from your collection.</AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">Delete</AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ViewDocument;
