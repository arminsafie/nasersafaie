import AdminDashboard from "./AdminDashboard";

export const metadata = {
  title: "Admin — Site content",
  robots: { index: false, follow: false },
};

export default function AdminPage() {
  return <AdminDashboard />;
}
