export interface Document {
  id: number;
  name: string;
  type: DocumentType;
  filePath: string;
  thumbnailPath?: string;
  ownerId: number;
  ownerName?: string;
  description?: string;
  createdAt: string;
  updatedAt?: string;
}

export type DocumentType =
  | "AADHAR"
  | "PAN"
  | "PASSPORT"
  | "BANK_PASSBOOK"
  | "PHOTO"
  | "CERTIFICATE"
  | "OTHER";

export const DOCUMENT_TYPE_LABELS: Record<DocumentType, string> = {
  AADHAR: "Aadhar Card",
  PAN: "PAN Card",
  PASSPORT: "Passport",
  BANK_PASSBOOK: "Bank Passbook",
  PHOTO: "Photo",
  CERTIFICATE: "Certificate",
  OTHER: "Other",
};

export interface DocumentCreateRequest {
  name: string;
  type: DocumentType;
  filePath: string;
  thumbnailPath?: string;
  ownerId: number;
  description?: string;
}

export interface DocumentUpdateRequest {
  name?: string;
  type?: DocumentType;
  description?: string;
}
