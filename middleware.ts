// export { default } from "next-auth/middleware";
import { withAuth } from "next-auth/middleware";
import { NextRequest, NextResponse } from "next/server";

export default withAuth(
  // `withAuth` augments your `Request` with the user's token.
  function middleware(req) {
    console.log("token: ", req.nextauth.token);
    
    const userRole = req.nextauth.token?.role;
    const pathname = req.nextUrl.pathname;

    // Admin-only routes
    if (pathname.startsWith("/admin") && userRole !== "admin") {
      return NextResponse.rewrite(
        new URL("/auth/login?message=You Are Not Authorized!", req.url)
      );
    }

    // Student routes - accessible by students, recruiters, and admins
    if ((pathname.startsWith("/user") || pathname.startsWith("/student")) && 
        userRole !== "student" && userRole !== "recruiter" && userRole !== "admin") {
      return NextResponse.rewrite(
        new URL("/auth/student?message=You Are Not Authorized!", req.url)
      );
    }

    // Recruiter routes - accessible by recruiters and admins
    if (pathname.startsWith("/recruiter") && 
        userRole !== "recruiter" && userRole !== "admin") {
      return NextResponse.rewrite(
        new URL("/auth/recruiter?message=You Are Not Authorized!", req.url)
      );
    }

    // Alumni routes - accessible by alumni, recruiters, and admins
    if (pathname.startsWith("/alumni") && 
        userRole !== "alumni" && userRole !== "recruiter" && userRole !== "admin") {
      return NextResponse.rewrite(
        new URL("/auth/alumni?message=You Are Not Authorized!", req.url)
      );
    }
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token,
    },
  }
);

export const config = {
  matcher: ["/admin/:path*", "/user/:path*", "/student/:path*", "/recruiter/:path*", "/alumni/:path*"],
};
