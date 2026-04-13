// Metadata returned from backend
export interface UploadProps {
  id: string;        // custom app id
  file_id: string;   // MongoDB ObjectId
  filename: string;
  name: string;
  comments: string;
  path: string;
}

// Payload used when creating a new upload (frontend -> backend)
export interface UploadPayload {
  name: string;
  comments: string;
  file: File;        // actual file object from input[type="file"]
}

