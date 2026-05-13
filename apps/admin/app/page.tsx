"use server";

import { Dashboard } from "@admin/components/homePage";
import { apiFetchClient } from "@admin/lib/serverFetch";
import type { DashboardData } from "@db/contracts";
import { checkUserSession } from "@admin/lib/auth-helpers.ts";
import { ErrorState } from "@admin/components/ErrorState";
import { APIResult } from "@db/lib/serviceReturn";

export default async function Home() {
  const session = await checkUserSession();

  const result = await apiFetchClient<APIResult<DashboardData>>("/dashboard");

  if (result.status !== "success" || result.payload.status !== "success") {
    return <ErrorState message="Failed to load dashboard data" />;
  }

  return <Dashboard dashboardData={result.payload.data} session={session} />;
}
