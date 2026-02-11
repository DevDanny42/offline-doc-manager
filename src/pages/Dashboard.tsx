import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, User, LogOut, FileText, FolderOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from "@/components/ui/dropdown-menu";
import DocumentCard from "@/components/DocumentCard";
import SearchBar from "@/components/SearchBar";
import { documentApi } from "@/services/api";
import type { User as UserType } from "@/types/User";
import type { Document } from "@/types/Document";
import { useToast } from "@/hooks/use-toast";

// Demo data for when backend is not available
const DEMO_DOCUMENTS: Document[] = [
  { id: 1, name: "Aadhar Card", type: "AADHAR", filePath: "/files/aadhar.jpg", ownerId: 1, description: "Personal Aadhar", createdAt: "2025-01-15T10:00:00Z" },
  { id: 2, name: "PAN Card", type: "PAN", filePath: "/files/pan.jpg", ownerId: 1, description: "Income tax PAN", createdAt: "2025-02-01T10:00:00Z" },
  { id: 3, name: "Bank Passbook", type: "BANK_PASSBOOK", filePath: "/files/passbook.jpg", ownerId: 1, description: "SBI Savings Account", createdAt: "2025-02-10T10:00:00Z" },
  { id: 4, name: "Passport Photo", type: "PHOTO", filePath: "/files/photo.jpg", ownerId: 1, description: "Recent passport size photo", createdAt: "2025-03-05T10:00:00Z" },
  { id: 5, name: "Degree Certificate", type: "CERTIFICATE", filePath: "/files/degree.pdf", ownerId: 1, description: "B.Tech Computer Science", createdAt: "2025-03-20T10:00:00Z" },
];

const Dashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [user, setUser] = useState<UserType | null>(null);
  const [documents, setDocuments] = useState<Document[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem("user");
    if (!stored) { navigate("/"); return; }
    setUser(JSON.parse(stored));
  }, [navigate]);

  useEffect(() => {
    if (!user) return;
    const fetchDocs = async () => {
      try {
        const docs = await documentApi.getAll(user.id);
        setDocuments(docs);
      } catch {
        setDocuments(DEMO_DOCUMENTS);
      } finally {
        setLoading(false);
      }
    };
    fetchDocs();
  }, [user]);

  const filteredDocs = useMemo(() => {
    if (!search.trim()) return documents;
    const q = search.toLowerCase();
    return documents.filter(
      d => d.name.toLowerCase().includes(q) || d.description?.toLowerCase().includes(q)
    );
  }, [documents, search]);

  const handleDelete = async (id: number) => {
    try {
      await documentApi.delete(id);
    } catch {
      // fallback
    }
    setDocuments(prev => prev.filter(d => d.id !== id));
    toast({ title: "Document deleted" });
  };

  const handleView = (doc: Document) => {
    navigate(`/document/${doc.id}`);
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/");
  };

  const initials = user?.fullName?.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2) || "U";

  return (
    <div className="min-h-screen bg-background">
      {/* Top bar */}
      <header className="sticky top-0 z-50 bg-card/80 backdrop-blur-lg border-b border-border">
        <div className="container max-w-3xl flex items-center justify-between h-16">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-lg bg-primary flex items-center justify-center">
              <FileText className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="font-display font-bold text-lg text-foreground">DocManager</span>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="rounded-full">
                <Avatar className="w-9 h-9">
                  <AvatarFallback className="bg-accent text-accent-foreground text-sm font-semibold">
                    {initials}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem onClick={() => navigate("/profile")}>
                <User className="w-4 h-4 mr-2" /> Profile
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout} className="text-destructive">
                <LogOut className="w-4 h-4 mr-2" /> Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>

      {/* Content */}
      <main className="container max-w-3xl py-6 space-y-6">
        {/* Greeting + Add */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-display font-bold text-foreground">
              Hi, {user?.fullName?.split(" ")[0] || "there"} 👋
            </h1>
            <p className="text-muted-foreground text-sm mt-0.5">
              {documents.length} document{documents.length !== 1 ? "s" : ""} stored
            </p>
          </div>
          <Button onClick={() => navigate("/add-document")} className="h-10 shadow-accent-glow">
            <Plus className="w-4 h-4 mr-1" /> Add New
          </Button>
        </div>

        {/* Search */}
        <SearchBar value={search} onChange={setSearch} />

        {/* Document List */}
        {loading ? (
          <div className="space-y-3">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-24 bg-muted rounded-lg animate-pulse" />
            ))}
          </div>
        ) : filteredDocs.length > 0 ? (
          <div className="space-y-3">
            {filteredDocs.map((doc, i) => (
              <div key={doc.id} style={{ animationDelay: `${i * 60}ms` }}>
                <DocumentCard document={doc} onView={handleView} onDelete={handleDelete} />
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 text-center animate-fade-in">
            <div className="w-16 h-16 rounded-2xl bg-muted flex items-center justify-center mb-4">
              <FolderOpen className="w-8 h-8 text-muted-foreground" />
            </div>
            <h3 className="font-display font-semibold text-foreground mb-1">
              {search ? "No documents found" : "No documents yet"}
            </h3>
            <p className="text-muted-foreground text-sm">
              {search ? "Try a different search term" : "Tap 'Add New' to store your first document"}
            </p>
          </div>
        )}
      </main>
    </div>
  );
};

export default Dashboard;
