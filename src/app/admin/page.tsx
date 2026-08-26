import type { Metadata } from "next";
import { AdminDashboard } from "@/components/admin/AdminDashboard";
import { AdminLogin } from "@/components/admin/AdminLogin";
import { isAdminAuthed } from "@/lib/adminAuth";

export const metadata: Metadata = {
  title: "Admin",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const authed = await isAdminAuthed();
  return (
    <section className="relative">
      <div className={`container-x pb-24 pt-32 lg:pt-36 ${authed ? "max-w-6xl" : "max-w-4xl"}`}>
        {authed ? <AdminDashboard /> : <AdminLogin />}
      </div>
    </section>
  );
}
