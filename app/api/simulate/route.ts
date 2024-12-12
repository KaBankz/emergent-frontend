import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const { simulation } = await request.json();
  console.log(simulation);
  return NextResponse.json({ message: 'Simulation started' });
}
