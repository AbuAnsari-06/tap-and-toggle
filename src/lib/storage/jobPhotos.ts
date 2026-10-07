import { getAdminSupabaseClient } from "@/lib/supabase/server";
import { JobPhoto } from "@/types/database";

// In-memory fallback cache for local dev / demo mode
const memoryJobPhotos = new Map<string, JobPhoto[]>();

// Seed sample photos for demo jobs so technicians and admins see realistic previews
memoryJobPhotos.set("job-demo-01", [
  {
    id: "photo-seed-01",
    job_id: "job-demo-01",
    photo_url: "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=800&q=80",
    file_name: "bathroom_mixer_leak.jpg",
    file_size: 450000,
    uploaded_by: "customer",
    created_at: new Date(Date.now() - 3600000).toISOString(),
  },
  {
    id: "photo-seed-02",
    job_id: "job-demo-01",
    photo_url: "https://images.unsplash.com/photo-1585704032915-c3400ca199e7?auto=format&fit=crop&w=800&q=80",
    file_name: "pipe_corrosion_under_sink.jpg",
    file_size: 620000,
    uploaded_by: "customer",
    created_at: new Date(Date.now() - 3500000).toISOString(),
  },
]);

memoryJobPhotos.set("job-p1-001", [
  {
    id: "photo-seed-03",
    job_id: "job-p1-001",
    photo_url: "https://images.unsplash.com/photo-1542013936693-884638332954?auto=format&fit=crop&w=800&q=80",
    file_name: "burst_kitchen_pipe.jpg",
    file_size: 580000,
    uploaded_by: "customer",
    created_at: new Date(Date.now() - 1800000).toISOString(),
  },
]);

export interface InputPhoto {
  dataUrl: string;
  name?: string;
  size?: number;
  uploadedBy?: "customer" | "pro" | "admin";
}

/**
 * Persists customer or pro fixture photos to the database table `public.job_photo`
 * and updates the in-memory fallback cache.
 */
export async function saveJobPhotos(
  jobId: string,
  photos: InputPhoto[]
): Promise<JobPhoto[]> {
  if (!jobId || !photos || photos.length === 0) return [];

  const createdRecords: JobPhoto[] = photos.map((p, idx) => ({
    id: crypto.randomUUID(),
    job_id: jobId,
    photo_url: p.dataUrl,
    file_name: p.name || `photo_${idx + 1}.jpg`,
    file_size: p.size || null,
    uploaded_by: p.uploadedBy || "customer",
    created_at: new Date().toISOString(),
  }));

  // Update in-memory fallback
  const existing = memoryJobPhotos.get(jobId) || [];
  memoryJobPhotos.set(jobId, [...existing, ...createdRecords]);

  // Insert into live Supabase if connected
  try {
    const supabase = getAdminSupabaseClient();
    const { error } = await (supabase.from("job_photo") as any).insert(
      createdRecords.map((r) => ({
        id: r.id,
        job_id: r.job_id,
        photo_url: r.photo_url,
        file_name: r.file_name,
        file_size: r.file_size,
        uploaded_by: r.uploaded_by,
      }))
    );

    if (error) {
      console.warn("Notice: job_photo database insert warning:", error.message);
    } else {
      console.log(`📸 Successfully saved ${createdRecords.length} photo(s) to public.job_photo for job ${jobId}`);
    }
  } catch (err: any) {
    console.warn("Notice: Operating in demo/offline mode for job_photo:", err.message);
  }

  return createdRecords;
}

/**
 * Retrieves all photos for a given job ID from `public.job_photo`
 * with automatic fallback to memory cache.
 */
export async function getJobPhotos(jobId: string): Promise<JobPhoto[]> {
  if (!jobId) return [];

  try {
    const supabase = getAdminSupabaseClient();
    const { data, error } = await (supabase.from("job_photo") as any)
      .select("*")
      .eq("job_id", jobId)
      .order("created_at", { ascending: true });

    if (!error && data && data.length > 0) {
      return data as JobPhoto[];
    }
  } catch {
    // In local dev/demo mode, use memory fallback
  }

  return memoryJobPhotos.get(jobId) || [];
}
