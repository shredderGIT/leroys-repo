import { NextResponse } from "next/server";
import { getExportMetadata, getPassports } from "@/lib/dpp-adapter";
export function GET() { return NextResponse.json({ metadata: getExportMetadata(), passports: getPassports() }); }
