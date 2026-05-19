"use client";

import { AlertTriangle } from "lucide-react";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function GlobalError({ error, reset }: ErrorProps) {
  useEffect(() => {
    // Hook this up to an observability tool (Sentry, etc.) when wired up.
    console.error(error);
  }, [error]);

  return (
    <div className="container-page grid place-items-center py-24 text-center">
      <div className="max-w-md space-y-4">
        <div className="mx-auto grid size-16 place-items-center rounded-full bg-bg-elevated text-danger">
          <AlertTriangle className="size-8" aria-hidden />
        </div>
        <h1 className="text-3xl font-semibold tracking-tight">
          Terjadi kesalahan
        </h1>
        <p className="text-fg-muted">
          Maaf, ada error yang tidak terduga. Coba muat ulang halaman atau
          kembali nanti.
        </p>
        <div className="flex justify-center gap-3 pt-2">
          <Button onClick={reset}>Coba Lagi</Button>
        </div>
      </div>
    </div>
  );
}
