import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, User, LogOut, FileText, Search, UserPlus, Phone, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from "@/components/ui/dropdown-menu";
import { Card, CardContent } from "@/components/ui/card";
import SearchBar from "@/components/SearchBar";
import { personApi } from "@/services/api";
import type { User as UserType } from "@/types/User";
import type { Person } from "@/types/Person";
import { useToast } from "@/hooks/use-toast";

const DEMO_PERSONS: Person[] = [
  { id: 1, name: "Rahul Sharma", phone: "9876543210", address: "123 MG Road, Delhi", createdByUserId: 1, createdAt: "2025-01-15T10:00:00Z" },
  { id: 2, name: "Priya Patel", phone: "9123456789", address: "45 Park Street, Mumbai", createdByUserId: 1, createdAt: "2025-02-01T10:00:00Z" },
  { id: 3, name: "Amit Kumar", phone: "9988776655", address: "78 Lake View, Bangalore", createdByUserId: 1, createdAt: "2025-03-05T10:00:00Z" },
];

const Dashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [user, setUser] = useState<UserType | null>(null);
  const [persons, setPersons] = useState<Person[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem("user");
    if (!stored) { navigate("/"); return; }
    setUser(JSON.parse(stored));
  }, [navigate]);

  useEffect(() => {
    if (!user) return;
    const fetchPersons = async () => {
      try {
        const data = await personApi.getAll(user.id);
        setPersons(data);
      } catch {
        setPersons(DEMO_PERSONS);
      } finally {
        setLoading(false);
      }
    };
    fetchPersons();
  }, [user]);

  const filteredPersons = useMemo(() => {
    if (!search.trim()) return persons;
    const q = search.toLowerCase();
    return persons.filter(
      p => p.name.toLowerCase().includes(q) || p.phone?.includes(q)
    );
  }, [persons, search]);

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
              {persons.length} person{persons.length !== 1 ? "s" : ""} saved
            </p>
          </div>
          <Button onClick={() => navigate("/add-person")} className="h-10 shadow-accent-glow">
            <UserPlus className="w-4 h-4 mr-1" /> Add Person
          </Button>
        </div>

        {/* Search */}
        <SearchBar value={search} onChange={setSearch} placeholder="Search by name or phone..." />

        {/* Person List */}
        {loading ? (
          <div className="space-y-3">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-24 bg-muted rounded-lg animate-pulse" />
            ))}
          </div>
        ) : filteredPersons.length > 0 ? (
          <div className="space-y-3">
            {filteredPersons.map((person, i) => (
              <div key={person.id} style={{ animationDelay: `${i * 60}ms` }}>
                <Card
                  className="shadow-card border-0 hover:shadow-card-hover transition-all duration-200 cursor-pointer group animate-fade-in"
                  onClick={() => navigate(`/person/${person.id}`)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <Avatar className="w-12 h-12 shrink-0">
                        <AvatarFallback className="bg-primary/10 text-primary font-semibold text-base">
                          {person.name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-foreground truncate">{person.name}</h3>
                        {person.phone && (
                          <div className="flex items-center gap-1.5 mt-1 text-sm text-muted-foreground">
                            <Phone className="w-3.5 h-3.5" />
                            <span>{person.phone}</span>
                          </div>
                        )}
                        {person.address && (
                          <div className="flex items-center gap-1.5 mt-0.5 text-sm text-muted-foreground truncate">
                            <MapPin className="w-3.5 h-3.5 shrink-0" />
                            <span className="truncate">{person.address}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 text-center animate-fade-in">
            <div className="w-16 h-16 rounded-2xl bg-muted flex items-center justify-center mb-4">
              <Search className="w-8 h-8 text-muted-foreground" />
            </div>
            <h3 className="font-display font-semibold text-foreground mb-1">
              {search ? "No persons found" : "No persons added yet"}
            </h3>
            <p className="text-muted-foreground text-sm">
              {search ? "Try a different name or phone number" : "Tap 'Add Person' to save someone's information"}
            </p>
          </div>
        )}
      </main>
    </div>
  );
};

export default Dashboard;
