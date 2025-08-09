"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

const StudentLogoutPage = () => {
  const router = useRouter();

  useEffect(() => {
    // Redirect to main logout page with student-specific callback
    router.replace('/auth/logout?callbackUrl=/auth/student&message=Student logout requested');
  }, [router]);

  return (
    <div className="flex justify-center items-center h-screen bg-gradient-to-br from-purple-50 to-purple-100">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
    </div>
  );
};

export default StudentLogoutPage;
