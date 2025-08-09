"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

const AdminLogoutPage = () => {
  const router = useRouter();

  useEffect(() => {
    // Redirect to main logout page with admin-specific callback
    router.replace('/auth/logout?callbackUrl=/auth/admin&message=Admin logout requested');
  }, [router]);

  return (
    <div className="flex justify-center items-center h-screen bg-gradient-to-br from-red-50 to-red-100">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
    </div>
  );
};

export default AdminLogoutPage;
