"use server";

import { Dashboard } from "@admin/component/homePage";
import { apiFetchClient } from "@admin/lib/fetchClient";
import { DashboardData } from "@api/src/routes/dashboard.routes";
import { checkUserSession } from "@admin/lib/auth-helpers.ts";

export default async function Home() {
  const session = await checkUserSession()

  const { data, error } = await apiFetchClient<DashboardData>("/dashboard");

  if (error) {
    return <p>Data fetch failed. Please try again later.</p>;
  }

  if (!data) {
    return <p>Data not available</p>;
  }

  return <Dashboard dashboardData={data} session={session} />;
}
