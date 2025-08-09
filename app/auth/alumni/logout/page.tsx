"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

const AlumniLogoutPage = () => {
  const router = useRouter();

  useEffect(() => {
    // Redirect to main logout page with alumni-specific callback
    router.replace('/auth/logout?callbackUrl=/auth/alumni&message=Alumni logout requested');
  }, [router]);

  return (
    <div className="flex justify-center items-center h-screen bg-gradient-to-br from-blue-50 to-blue-100">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
    </div>
  );
};

export default AlumniLogoutPage;
