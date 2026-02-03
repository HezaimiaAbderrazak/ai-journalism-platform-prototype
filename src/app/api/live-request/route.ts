import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { action, requestId } = body;

    // In a real app, you would update the database here.
    // For this prototype, we'll return a success response.
    
    return NextResponse.json({ 
      success: true, 
      message: `Live request ${requestId} has been ${action}ed successfully.`,
      status: action === 'accept' ? 'approved' : 'rejected'
    });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 });
  }
}
