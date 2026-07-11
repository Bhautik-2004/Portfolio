"use client";

import { FormEvent, useEffect, useRef, useState } from "react";

type FileEntry = {
  name: string;
  size: number;
  type: string;
  uploadedAt: string;
};

function formatSize(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleString();
}

export default function AdminPage() {
  const [authenticated, setAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [files, setFiles] = useState<FileEntry[]>([]);
  const [dragging, setDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (document.cookie.includes("token=")) {
      setAuthenticated(true);
      fetchFiles();
    }
  }, []);

  async function fetchFiles() {
    const res = await fetch("/api/files");
    if (res.ok) {
      const data = await res.json();
      setFiles(data.files);
    }
  }

  async function handleLogin(e: FormEvent) {
    e.preventDefault();
    setError("");
    const res = await fetch("/api/auth", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });
    if (res.ok) {
      setAuthenticated(true);
      setPassword("");
      fetchFiles();
    } else {
      setError("Invalid password");
    }
  }

  function handleLogout() {
    document.cookie = "token=; max-age=0; path=/";
    setAuthenticated(false);
    setFiles([]);
  }

  async function uploadFile(file: File) {
    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);
    await fetch("/api/files", { method: "POST", body: formData });
    setUploading(false);
    fetchFiles();
  }

  function handleFileSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) uploadFile(file);
    if (inputRef.current) inputRef.current.value = "";
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) uploadFile(file);
  }

  async function deleteFile(name: string) {
    await fetch("/api/files", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name }),
    });
    fetchFiles();
  }

  return (
    <div className="h-dvh flex items-center justify-center px-4 overflow-hidden">
      {!authenticated ? (
        <form
          onSubmit={handleLogin}
          className="w-full max-w-sm space-y-4 p-8 rounded-xl border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900"
        >
          <h1 className="text-xl font-semibold text-center">Admin Login</h1>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            className="w-full px-4 py-2 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-transparent outline-none focus:border-neutral-500"
            autoFocus
          />
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <button
            type="submit"
            className="w-full py-2 rounded-lg bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 font-medium hover:opacity-90"
          >
            Login
          </button>
        </form>
      ) : (
        <div className="flex flex-col gap-4 w-full max-w-lg max-h-dvh py-8">
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-semibold">File Storage</h1>
            <button
              onClick={handleLogout}
              className="text-sm text-neutral-500 hover:text-neutral-800 dark:hover:text-neutral-200"
            >
              Logout
            </button>
          </div>

          <div
            onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
            onDragLeave={() => setDragging(false)}
            onDrop={handleDrop}
            onClick={() => inputRef.current?.click()}
            className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-colors ${
              dragging
                ? "border-neutral-500 bg-neutral-100 dark:bg-neutral-800"
                : "border-neutral-300 dark:border-neutral-700 hover:border-neutral-400 dark:hover:border-neutral-600"
            }`}
          >
            <input
              ref={inputRef}
              type="file"
              onChange={handleFileSelect}
              className="hidden"
            />
            {uploading ? (
              <p className="text-neutral-500">Uploading...</p>
            ) : (
              <p className="text-neutral-500">
                Drop a file here or click to browse
              </p>
            )}
          </div>

          <div className="space-y-2 overflow-y-auto flex-1 min-h-0">
            {files.length === 0 && (
              <p className="text-neutral-500 text-center py-6">No files uploaded yet</p>
            )}
            {files.map((file) => (
              <div
                key={file.uploadedAt + file.name}
                className="flex items-center justify-between p-4 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900"
              >
                <div className="min-w-0 flex-1">
                  <p className="font-medium truncate">{file.name}</p>
                  <p className="text-sm text-neutral-500">
                    {formatSize(file.size)} &middot; {formatDate(file.uploadedAt)}
                  </p>
                </div>
                <div className="flex items-center gap-2 ml-4">
                  <a
                    href={`/uploads/${encodeURIComponent(file.name)}`}
                    target="_blank"
                    className="px-3 py-1.5 text-sm rounded-lg border border-neutral-300 dark:border-neutral-700 hover:bg-neutral-100 dark:hover:bg-neutral-800"
                  >
                    Open
                  </a>
                  <button
                    onClick={() => deleteFile(file.name)}
                    className="px-3 py-1.5 text-sm rounded-lg bg-red-500 text-white hover:bg-red-600"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
