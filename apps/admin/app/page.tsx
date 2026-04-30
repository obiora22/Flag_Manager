"use server";

import { Dashboard } from "@admin/components/homePage";
import { apiFetchClient } from "@admin/lib/serverFetch";
import { DashboardData } from "@api/src/routes/dashboard.routes";
import { checkUserSession } from "@admin/lib/auth-helpers.ts";
import {ErrorState} from "@admin/components/ErrorState"

export default async function Home() {
  const session = await checkUserSession();

  const { data, error } = await apiFetchClient<DashboardData>("/dashboard");

  if (error) {
    return <ErrorState />;
  }

  if (!data) {
    return <EmptyState />
  }

  return <Dashboard dashboardData={data} session={session} />;
}
