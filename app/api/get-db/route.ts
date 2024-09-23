import { NextResponse, NextRequest } from 'next/server';
import { sql } from "@vercel/postgres";

export async function POST(req: NextRequest) {
    const {id} = await req.json();
    const res = await sql`select * from zanghatable where id = ${id}`;
    return NextResponse.json(res);
}