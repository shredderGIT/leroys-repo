import { NextResponse } from "next/server";
import { getPassport } from "@/lib/dpp-adapter";
export async function GET(_: Request, { params }: { params: Promise<{ dppId: string }> }) {
  const { dppId } = await params;
  const passport = getPassport(decodeURIComponent(dppId));
  return passport ? NextResponse.json(passport) : NextResponse.json({ error: "Passport not found" }, { status: 404 });
}
