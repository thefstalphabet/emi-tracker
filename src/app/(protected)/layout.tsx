import { Sidebar } from "@/components/sidebar";

export default function protectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen overflow-hidden bg-[#F5F6F8]">
      <Sidebar />
      <div className="mt-3 p-8 rounded-lg w-full bg-white flex-1 overflow-y-auto">
        {children}
      </div>
    </div>
  );
}
