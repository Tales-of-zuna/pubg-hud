import Sidebar from "@/components/admin/sidebar";

const AdminLayout = ({ children }: any) => {
  return (
    <div className="flex h-screen w-screen items-center bg-neutral-900">
      <Sidebar />

      <div className="h-full w-full p-8">{children}</div>
    </div>
  );
};

export default AdminLayout;
