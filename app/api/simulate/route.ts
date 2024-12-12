import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const { scenario } = await request.json();
  fetch(`${process.env.API_URL}/simulate`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ scenario }),
  });
  return NextResponse.json({ message: 'Simulation started' });
}
