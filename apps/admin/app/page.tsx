"use server";
import { auth } from "@admin/auth";
import { Dashboard } from "@admin/component/homePage";
import { apiFetchClient } from "@admin/lib/fetchClient";
import { DDATA } from "@api/src/routes/dashboard.routes";

export default async function Home() {
  const session = await auth();

  if (!session) {
    return <h1>Access denied</h1>;
  }

  const { data, error } = await apiFetchClient<DDATA>("/dashboard");

  if (error) {
    return <p>Data fetch failed. Please try again later.</p>;
  }

  if (!data) {
    return <p>Data not available</p>;
  }

  return <Dashboard dashboardData={data} session={session} />;
}
