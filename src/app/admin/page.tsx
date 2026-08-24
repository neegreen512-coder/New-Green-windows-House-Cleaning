import type { Metadata } from "next";
import { AdminDashboard } from "@/components/admin/AdminDashboard";

export const metadata: Metadata = {
  title: "Admin",
  robots: { index: false, follow: false },
};

export default function AdminPage() {
  return (
    <section className="relative">
      <div className="container-x max-w-4xl pb-24 pt-32 lg:pt-40">
        <AdminDashboard />
      </div>
    </section>
  );
}
