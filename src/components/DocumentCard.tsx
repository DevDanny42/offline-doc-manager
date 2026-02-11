import { FileText, Eye, Trash2, MoreVertical } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import type { Document, DocumentType } from "@/types/Document";
import { DOCUMENT_TYPE_LABELS } from "@/types/Document";

const TYPE_COLORS: Record<DocumentType, string> = {
  AADHAR: "bg-primary/10 text-primary",
  PAN: "bg-accent/10 text-accent",
  PASSPORT: "bg-success/10 text-success",
  BANK_PASSBOOK: "bg-warning/10 text-warning",
  PHOTO: "bg-primary/10 text-primary",
  CERTIFICATE: "bg-success/10 text-success",
  OTHER: "bg-muted text-muted-foreground",
};

interface DocumentCardProps {
  document: Document;
  onView: (doc: Document) => void;
  onDelete: (id: number) => void;
}

const DocumentCard = ({ document, onView, onDelete }: DocumentCardProps) => {
  return (
    <Card className="shadow-card border-0 hover:shadow-card-hover transition-all duration-200 cursor-pointer group animate-fade-in">
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <div className="w-12 h-12 rounded-xl bg-primary/5 flex items-center justify-center shrink-0 group-hover:bg-primary/10 transition-colors">
            <FileText className="w-6 h-6 text-primary" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0">
                <h3 className="font-semibold text-foreground truncate">{document.name}</h3>
                <p className="text-sm text-muted-foreground mt-0.5 truncate">
                  {document.description || "No description"}
                </p>
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="shrink-0 h-8 w-8">
                    <MoreVertical className="w-4 h-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => onView(document)}>
                    <Eye className="w-4 h-4 mr-2" /> View
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => onDelete(document.id)} className="text-destructive">
                    <Trash2 className="w-4 h-4 mr-2" /> Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            <div className="flex items-center gap-2 mt-3">
              <Badge variant="secondary" className={TYPE_COLORS[document.type]}>
                {DOCUMENT_TYPE_LABELS[document.type]}
              </Badge>
              <span className="text-xs text-muted-foreground">
                {new Date(document.createdAt).toLocaleDateString()}
              </span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default DocumentCard;
