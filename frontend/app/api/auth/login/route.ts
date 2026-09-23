import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

const PERSONAS = [
  {
    id: 'pm-1',
    name: 'Sarah Jenkins',
    role: 'pm',
    title: 'Principal Product Manager',
    email: 'sarah.pm@productbrain.io',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150'
  },
  {
    id: 'sales-1',
    name: 'Michael Chang',
    role: 'sales',
    title: 'VP of Enterprise Sales',
    email: 'michael.sales@productbrain.io',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150'
  },
  {
    id: 'eng-1',
    name: 'Alex Rivera',
    role: 'engineering',
    title: 'Staff Engineering Lead',
    email: 'alex.eng@productbrain.io',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'
  }
];

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { personaId, email, role } = body;

    let selectedPersona = PERSONAS.find((p) => p.id === personaId || p.email === email);

    if (!selectedPersona) {
      selectedPersona = {
        id: `user-${Date.now()}`,
        name: email ? email.split('@')[0] : 'Enterprise User',
        role: role || 'pm',
        title: 'Enterprise Specialist',
        email: email || 'user@productbrain.io',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'
      };
    }

    return NextResponse.json({
      success: true,
      token: `pb-session-${Date.now()}`,
      user: selectedPersona
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
