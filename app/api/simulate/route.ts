import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const { scenario } = await request.json();
  console.log(scenario);
  return NextResponse.json({ message: 'Simulation started' });
}
