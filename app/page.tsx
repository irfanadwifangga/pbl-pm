import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";

export default async function HomePage() {
  const session = await auth();

  if (session) {
    const role = session.user.role;
    if (role === "STUDENT") redirect("/dashboard/mahasiswa");
    if (role === "ADMIN") redirect("/dashboard/admin");
    if (role === "WADIR3") redirect("/dashboard/wadir");
  }

  redirect("/login");
}
