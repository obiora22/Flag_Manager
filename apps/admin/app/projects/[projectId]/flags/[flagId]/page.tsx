import { ErrorState } from "@admin/components/ErrorState";
import { FlagDetails } from "@admin/components/FlagDetails.tsx";
import { checkUserSession } from "@admin/lib/auth-helpers";
import { apiFetchClient } from "@admin/lib/serverFetch.ts";
import type { APIResult, FlagData } from "@packages/db/sharedTypes";
import { Suspense } from "react";

interface Props {
  params: Promise<{
    projectId: string;
    flagId: string;
  }>;
  searchParams: Promise<{
    projectName: string;
  }>;
}

export default async function FlagPage({ params, searchParams }: Props) {
  await checkUserSession();

  const { projectId, flagId } = await params;
  const { projectName } = await searchParams;

  const result = await apiFetchClient<APIResult<FlagData>>(`/flags/${flagId}`);

  if (result.status !== "success" || result.payload.status !== "success") {
    return <ErrorState message="something went wrong. Try again." />;
  }

  return (
    <Suspense fallback={<FlagDetailSkeleton />}>
      <FlagDetails flag={result.payload.data} projectId={projectId} projectName={projectName} />
    </Suspense>
  );
}

function FlagDetailSkeleton() {
  return (
    <div className="min-h-screen bg-linear-to-br from-slate-950 via-slate-900 to-slate-950">
      <div className="border-b border-slate-800/50 backdrop-blur-sm bg-slate-900/30">
        <div className="max-w-7xl mx-auto px-8 py-6">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-4 flex-1">
              <div className="w-10 h-10 bg-slate-800 rounded-lg animate-pulse" />
              <div className="flex-1">
                <div className="h-8 w-64 bg-slate-800 rounded animate-pulse mb-2" />
                <div className="h-5 w-96 bg-slate-800 rounded animate-pulse" />
              </div>
            </div>
            <div className="flex gap-3">
              <div className="w-32 h-10 bg-slate-800 rounded animate-pulse" />
              <div className="w-10 h-10 bg-slate-800 rounded animate-pulse" />
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-8">
          <div className="flex gap-4 border-b border-slate-800/50">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-12 w-24 bg-slate-800 rounded-t animate-pulse" />
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-64 bg-slate-800/40 rounded-xl animate-pulse" />
            ))}
          </div>
          <div className="space-y-6">
            {[...Array(2)].map((_, i) => (
              <div key={i} className="h-48 bg-slate-800/40 rounded-xl animate-pulse" />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
