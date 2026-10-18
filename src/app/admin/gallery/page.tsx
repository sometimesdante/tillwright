"use client";

import { createClient } from "@/utils/supabase/client";
import Image from "next/image";
import { useCallback, useEffect, useState } from "react";

export default function GalleryDashboard() {

  const supabase = createClient();
  const [files, setFiles] = useState<any[]>([]);
  const bucket = "productImages";

  const fetchFiles = useCallback(async () => {
    const { data, error } = await supabase.storage.from(bucket).list();

    if (error) {
      console.error("Error fetching files:", error);
      return;
    }

    if (!data) {
      console.warn("No files found in the bucket.");
      setFiles([]);
      return;
    }


    const files = data.map((file) => ({
      ...file,
      url: supabase.storage.from(bucket).getPublicUrl(file.name).data.publicUrl,
    }));
    setFiles(files || []);
  }, [supabase]);

  useEffect(() => {
    fetchFiles();
  }, [fetchFiles]);


  return (
    <div>
      <div className="w-full flex justify-between mb-8">
        <h1 className="text-3xl">Gallery</h1>
        <span className="flex gap-4">
        </span>
      </div>
      <div className="grid grid-cols-3 gap-4">
        {files.map((f: any) => (
          <div key={f.id} className="bg-surface-raised shadow-float border-blue-600 border-0 hover:border-2">
            <div className="relative">
              <span className="m-1 top-2 right-2 absolute flex flex-row gap-1 cursor-pointer">
                <div className="bg-black p-1 w-2 h-2 rounded-md"></div>
                <div className="bg-black p-1 w-2 h-2 rounded-md"></div>
                <div className="bg-black p-1 w-2 h-2 rounded-md"></div>
              </span>
              <Image loading="eager" src={f.url} width={256} height={256} alt={f.name} className="w-full aspect-square" />
            </div>
            <div className="m-4">
              <p className="text-lg">{(f.name).slice(0, -5)}</p>
              <p className="text-ink-muted text-sm">{f.id}</p>
            </div>
          </div>
        ))}
      </div>
    </div >
  );
}
