import { NextRequest, NextResponse } from "next/server";
export async function POST(req: NextRequest) {
  const body = await req.text();
  // const body = await req.body;
  console.log(body);
  try {
    const response = await fetch("https://automate.paglipay.info/start/1", {
      method: "POST",
      body: body,
      headers: {
        "Content-Type": "application/json",
      },
    });
    const data = await response.json();
    return NextResponse.json(data, {
      status: 200,
    });
  } catch (error) {
    return NextResponse.json(error, {
      status: 500,
    });
  }
}
