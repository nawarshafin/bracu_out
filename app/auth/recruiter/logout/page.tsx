"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

const RecruiterLogoutPage = () => {
  const router = useRouter();

  useEffect(() => {
    // Redirect to main logout page with recruiter-specific callback
    router.replace('/auth/logout?callbackUrl=/auth/recruiter&message=Recruiter logout requested');
  }, [router]);

  return (
    <div className="flex justify-center items-center h-screen bg-gradient-to-br from-green-50 to-green-100">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
    </div>
  );
};

export default RecruiterLogoutPage;
