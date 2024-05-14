// app/_middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  console.log("ENTER");
  const { pathname } = request.nextUrl;

  // Si la requête commence par `/api`, rediriger vers le backend externe
  if (pathname.startsWith("/api/")) {
    const backendUrl = pathname.replace("/api", "http://localhost:8069");
    return NextResponse.rewrite(backendUrl);
  }

  // Pour les autres chemins, continuer avec le traitement habituel
  return NextResponse.next();
}
