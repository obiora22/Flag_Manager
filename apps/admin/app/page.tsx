"use server";
import { auth, signOut } from "@admin/auth";
import { HomePage } from "@admin/component/homePage";

export default async function Home() {
  const session = await auth();
  console.log({ session });

  if (!session) {
    return <h1>Access denied</h1>;
  }
  return <HomePage />;
}
