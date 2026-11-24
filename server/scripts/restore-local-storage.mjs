import { createHash } from "node:crypto";
import { readFile, readdir, stat } from "node:fs/promises";
import { basename, join, relative, sep } from "node:path";
import { parseArgs } from "node:util";
import { createClient } from "@supabase/supabase-js";
import { parse as parseEnv } from "dotenv";

const projectRoot = join(import.meta.dirname, "../..");
const localSecretsPath = join(
  projectRoot,
  "supabase/.temp/start-secrets/supabase_edge_runtime_palenque/env/docker.env",
);
const sourcePath = join(projectRoot, "supabase/storage-assets");
const bucketNames = new Set(["categories", "markets", "products", "users"]);
const contentTypes = new Map([
  [".jpeg", "image/jpeg"],
  [".jpg", "image/jpeg"],
  [".png", "image/png"],
]);

const { values } = parseArgs({
  options: {
    "dry-run": { type: "boolean", default: false },
    help: { type: "boolean", default: false },
  },
});

if (values.help) {
  console.log("Usage: npm run storage:restore -- [--dry-run]");
  process.exit(0);
}

const sourceStats = await stat(sourcePath).catch(() => null);

if (!sourceStats?.isDirectory()) {
  throw new Error(`Storage source is not a directory: ${sourcePath}`);
}

const files = await collectFiles(sourcePath);

if (files.length === 0) {
  throw new Error(`No storage files found in ${sourcePath}`);
}

for (const file of files) {
  console.log(`${file.bucketName}/${file.objectPath} (${file.size} bytes)`);
}

if (values["dry-run"]) {
  console.log(`Dry run complete: ${files.length} files ready to restore.`);
  process.exit(0);
}

const localSecrets = await readFile(localSecretsPath, "utf8")
  .then(parseEnv)
  .catch(() => ({}));
const serviceRoleKey =
  process.env.LOCAL_SUPABASE_SERVICE_ROLE_KEY ?? localSecrets.SUPABASE_SERVICE_ROLE_KEY;
const localPort = localSecrets.SUPABASE_INTERNAL_HOST_PORT ?? "54321";
const localUrl = process.env.LOCAL_SUPABASE_URL ?? `http://127.0.0.1:${localPort}`;
const parsedUrl = new URL(localUrl);

if (!["localhost", "127.0.0.1", "[::1]"].includes(parsedUrl.hostname)) {
  throw new Error("LOCAL_SUPABASE_URL must point to localhost or a loopback address.");
}

if (!serviceRoleKey) {
  throw new Error(
    "Local Supabase service role key is missing. Start local Supabase or set LOCAL_SUPABASE_SERVICE_ROLE_KEY.",
  );
}

const client = createClient(localUrl, serviceRoleKey, {
  auth: { autoRefreshToken: false, persistSession: false },
});
const { data: buckets, error: bucketError } = await client.storage.listBuckets();

if (bucketError) {
  throw new Error(`Cannot connect to local Supabase Storage: ${bucketError.message}`);
}

const existingBucketNames = new Set(buckets.map((bucket) => bucket.name));
const missingBucketNames = [...new Set(files.map((file) => file.bucketName))].filter(
  (bucketName) => !existingBucketNames.has(bucketName),
);

if (missingBucketNames.length > 0) {
  throw new Error(`Local Supabase is missing storage buckets: ${missingBucketNames.join(", ")}`);
}

for (const [index, file] of files.entries()) {
  const content = await readFile(file.sourcePath);
  const storage = client.storage.from(file.bucketName);
  const { error: uploadError } = await storage.upload(file.objectPath, content, {
    contentType: file.contentType,
    upsert: true,
  });

  if (uploadError) {
    throw new Error(`Upload failed for ${file.bucketName}/${file.objectPath}: ${uploadError.message}`);
  }

  const { data: downloadedFile, error: downloadError } = await storage.download(file.objectPath);

  if (downloadError) {
    throw new Error(
      `Verification download failed for ${file.bucketName}/${file.objectPath}: ${downloadError.message}`,
    );
  }

  const downloadedContent = Buffer.from(await downloadedFile.arrayBuffer());
  const sourceHash = createHash("sha256").update(content).digest("hex");
  const restoredHash = createHash("sha256").update(downloadedContent).digest("hex");

  if (sourceHash !== restoredHash) {
    throw new Error(`Verification failed for ${file.bucketName}/${file.objectPath}`);
  }

  console.log(`Restored ${index + 1}/${files.length}: ${file.bucketName}/${file.objectPath}`);
}

console.log(`Restored and verified ${files.length} files in local Supabase Storage.`);

async function collectFiles(directoryPath) {
  const entries = await readdir(directoryPath, { withFileTypes: true });
  const collectedFiles = [];

  for (const entry of entries) {
    if (entry.name === ".DS_Store") {
      continue;
    }

    const entryPath = join(directoryPath, entry.name);

    if (entry.isSymbolicLink()) {
      throw new Error(`Symbolic links are not supported in the source: ${entryPath}`);
    }

    if (entry.isDirectory()) {
      collectedFiles.push(...(await collectFiles(entryPath)));
      continue;
    }

    if (!entry.isFile()) {
      throw new Error(`Unsupported source entry: ${entryPath}`);
    }

    const pathParts = relative(sourcePath, entryPath).split(sep);
    const [bucketName, ...objectParts] = pathParts;

    if (!bucketNames.has(bucketName) || objectParts.length === 0) {
      throw new Error(`Unexpected storage path: ${entryPath}`);
    }

    const fileStats = await stat(entryPath);

    if (fileStats.size === 0) {
      throw new Error(`Source file is empty: ${entryPath}`);
    }

    const extension = basename(entryPath).match(/\.[^.]+$/)?.[0]?.toLowerCase();

    collectedFiles.push({
      bucketName,
      objectPath: objectParts.join("/"),
      sourcePath: entryPath,
      size: fileStats.size,
      contentType: contentTypes.get(extension) ?? "application/octet-stream",
    });
  }

  return collectedFiles.sort((first, second) =>
    `${first.bucketName}/${first.objectPath}`.localeCompare(
      `${second.bucketName}/${second.objectPath}`,
    ),
  );
}
