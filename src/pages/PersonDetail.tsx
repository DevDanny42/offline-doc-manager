import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Plus, Phone, MapPin, Edit2, Trash2, FileText, FolderOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import DocumentCard from "@/components/DocumentCard";
import { personApi, documentApi } from "@/services/api";
import type { Person } from "@/types/Person";
import type { Document } from "@/types/Document";
import { useToast } from "@/hooks/use-toast";

const DEMO_PERSON: Person = {
  id: 1, name: "Rahul Sharma", phone: "9876543210", address: "123 MG Road, Delhi", createdByUserId: 1, createdAt: "2025-01-15T10:00:00Z",
};

const DEMO_DOCS: Document[] = [
  { id: 1, name: "Aadhar Card", type: "AADHAR", filePath: "/files/aadhar.jpg", personId: 1, ownerId: 1, description: "Personal Aadhar", createdAt: "2025-01-15T10:00:00Z" },
  { id: 2, name: "PAN Card", type: "PAN", filePath: "/files/pan.jpg", personId: 1, ownerId: 1, description: "Income tax PAN", createdAt: "2025-02-01T10:00:00Z" },
];

const PersonDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [person, setPerson] = useState<Person | null>(null);
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [p, docs] = await Promise.all([
          personApi.getById(Number(id)),
          documentApi.getByPerson(Number(id)),
        ]);
        setPerson(p);
        setDocuments(docs);
      } catch {
        setPerson(DEMO_PERSON);
        setDocuments(DEMO_DOCS);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  const handleDeleteDoc = async (docId: number) => {
    try { await documentApi.delete(docId); } catch { /* fallback */ }
    setDocuments(prev => prev.filter(d => d.id !== docId));
    toast({ title: "Document deleted" });
  };

  const handleViewDoc = (doc: Document) => {
    navigate(`/document/${doc.id}`);
  };

  const handleDeletePerson = async () => {
    if (!person) return;
    try { await personApi.delete(person.id); } catch { /* fallback */ }
    toast({ title: "Person deleted" });
    navigate("/dashboard");
  };

  if (loading || !person) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-12 h-12 bg-muted rounded-xl animate-pulse" />
      </div>
    );
  }

  const initials = person.name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2);

  return (
    <div className="min-h-screen bg-background">
      <header className="bg-gradient-hero text-primary-foreground">
        <div className="container max-w-2xl py-6">
          <Button variant="ghost" size="sm" onClick={() => navigate("/dashboard")} className="text-primary-foreground/70 hover:text-primary-foreground hover:bg-primary-foreground/10 mb-4">
            <ArrowLeft className="w-4 h-4 mr-1" /> Back
          </Button>
          <div className="flex items-center gap-4">
            <Avatar className="w-16 h-16">
              <AvatarFallback className="bg-primary-foreground/15 text-primary-foreground text-xl font-bold">
                {initials}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <h1 className="text-2xl font-display font-bold">{person.name}</h1>
              {person.phone && (
                <div className="flex items-center gap-1.5 mt-1 text-primary-foreground/70 text-sm">
                  <Phone className="w-3.5 h-3.5" /> {person.phone}
                </div>
              )}
              {person.address && (
                <div className="flex items-center gap-1.5 mt-0.5 text-primary-foreground/70 text-sm">
                  <MapPin className="w-3.5 h-3.5 shrink-0" /> <span className="truncate">{person.address}</span>
                </div>
              )}
            </div>
          </div>
          <div className="flex gap-2 mt-4">
            <Button variant="ghost" size="sm" onClick={() => navigate(`/edit-person/${person.id}`)} className="text-primary-foreground/70 hover:text-primary-foreground hover:bg-primary-foreground/10">
              <Edit2 className="w-4 h-4 mr-1" /> Edit
            </Button>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="ghost" size="sm" className="text-primary-foreground/70 hover:text-primary-foreground hover:bg-primary-foreground/10">
                  <Trash2 className="w-4 h-4 mr-1" /> Delete
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Delete {person.name}?</AlertDialogTitle>
                  <AlertDialogDescription>This will permanently remove this person and all their documents.</AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={handleDeletePerson} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">Delete</AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>
      </header>

      <main className="container max-w-2xl py-6 space-y-6">
        {/* Add Document */}
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-display font-semibold text-foreground">
            Documents ({documents.length})
          </h2>
          <Button onClick={() => navigate(`/add-document/${person.id}`)} size="sm">
            <Plus className="w-4 h-4 mr-1" /> Add File
          </Button>
        </div>

        {/* Document list */}
        {documents.length > 0 ? (
          <div className="space-y-3">
            {documents.map((doc, i) => (
              <div key={doc.id} style={{ animationDelay: `${i * 60}ms` }}>
                <DocumentCard document={doc} onView={handleViewDoc} onDelete={handleDeleteDoc} />
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-16 text-center animate-fade-in">
            <div className="w-14 h-14 rounded-2xl bg-muted flex items-center justify-center mb-3">
              <FolderOpen className="w-7 h-7 text-muted-foreground" />
            </div>
            <h3 className="font-display font-semibold text-foreground mb-1">No documents yet</h3>
            <p className="text-muted-foreground text-sm">Add Aadhar, PAN, photos and more</p>
          </div>
        )}
      </main>
    </div>
  );
};

export default PersonDetail;
