// middleware.ts Verbatim
import { withAuth } from "next-auth/middleware";

export default withAuth({
  pages: {
    signIn: "/login",
  },
});

export const config = { 
  // Proteksi dashboard dan sub-routenya
  matcher: ["/dashboard/:path*"] 
};