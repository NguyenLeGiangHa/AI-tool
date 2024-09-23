import { NextResponse, NextRequest } from 'next/server';
import { sql } from "@vercel/postgres";

export async function POST(req: NextRequest) {
    const {id, tomTatTongQuan ,nguCanhKinhDoanh ,doLuongThanhCong ,buyerPersona, audience, business} = await req.json();
    // console.log(id, barriers ,benefits ,goal ,overview ,pains ,problem ,trigger);
    const res = await sql`insert into zanghatable values (${id}, ${business}, ${audience}, ${tomTatTongQuan}, ${nguCanhKinhDoanh}, ${doLuongThanhCong}, ${buyerPersona})`;
    return NextResponse.json(res);
}