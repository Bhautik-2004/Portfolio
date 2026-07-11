import { NextResponse } from "next/server";
import { writeFile, unlink, mkdir, readdir } from "fs/promises";
import path from "path";
import { statSync } from "fs";

const UPLOADS_DIR = path.join(process.cwd(), "public", "uploads");

async function getExistingFiles() {
  await mkdir(UPLOADS_DIR, { recursive: true });
  const names = await readdir(UPLOADS_DIR);
  const files = names
    .filter((name) => name !== ".gitkeep")
    .map((name) => {
      const stat = statSync(path.join(UPLOADS_DIR, name));
      return {
        name,
        size: stat.size,
        type: "",
        uploadedAt: stat.birthtime.toISOString(),
      };
    });
  return files.sort(
    (a, b) => new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime()
  );
}

export async function GET() {
  const files = await getExistingFiles();
  return NextResponse.json({ files });
}

export async function POST(request: Request) {
  const formData = await request.formData();
  const file = formData.get("file") as File | null;

  if (!file) {
    return NextResponse.json({ error: "No file provided" }, { status: 400 });
  }

  await mkdir(UPLOADS_DIR, { recursive: true });

  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  const filePath = path.join(UPLOADS_DIR, file.name);
  await writeFile(filePath, buffer);

  const stat = statSync(filePath);
  const entry = {
    name: file.name,
    size: stat.size,
    type: file.type,
    uploadedAt: stat.birthtime.toISOString(),
  };

  return NextResponse.json({ file: entry });
}

export async function DELETE(request: Request) {
  const { name } = await request.json();

  if (!name) {
    return NextResponse.json({ error: "No file name provided" }, { status: 400 });
  }

  const filePath = path.join(UPLOADS_DIR, name);
  await unlink(filePath).catch(() => {});

  return NextResponse.json({ success: true });
}
