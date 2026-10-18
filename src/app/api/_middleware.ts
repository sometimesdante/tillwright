import { NextResponse } from "next/server";

export function middleware(request: Request) {
  const origin = request.headers.get("origin");

  const response = NextResponse.next();

  // Allow only specific origins
  if (origin === "http://localhost:3000") {
    response.headers.set("Access-Control-Allow-Origin", origin);
    response.headers.set("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
    response.headers.set(
      "Access-Control-Allow-Headers",
      "Content-Type, Authorization"
    );
  }

  // Handle OPTIONS preflight requests
  if (request.method === "OPTIONS") {
    return new NextResponse(null, { status: 204 });
  }

  return response;
}
