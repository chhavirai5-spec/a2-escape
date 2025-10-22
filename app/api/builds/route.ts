import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const builds = await prisma.build.findMany({ orderBy: { createdAt: "desc" } });
  return NextResponse.json(builds);
}

export async function POST(req: NextRequest) {
  const body = await req.json(); // { scenario, html }
  if (!body?.scenario || !body?.html) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }
  const created = await prisma.build.create({ data: body });
  return NextResponse.json(created, { status: 201 });
}
