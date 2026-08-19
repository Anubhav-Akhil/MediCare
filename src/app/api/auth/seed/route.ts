import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import connectToDatabase from '@/lib/mongodb';
import User from '@/models/User';

const DEMO_USERS = [
  {
    name: 'Dr. Rajesh Kumar',
    email: 'doctor@medicare.com',
    password: 'password123',
    role: 'Doctor' as const,
    department: 'Cardiology',
  },
  {
    name: 'Admin User',
    email: 'admin@medicare.com',
    password: 'password123',
    role: 'Admin' as const,
    department: 'Hospital Administration',
  },
  {
    name: 'Dr. Sunita Verma',
    email: 'sunita.verma@medicare.com',
    password: 'password123',
    role: 'Doctor' as const,
    department: 'Dermatology',
  },
];

export async function POST() {
  try {
    await connectToDatabase();

    const createdUsers = [];

    for (const demo of DEMO_USERS) {
      const exists = await User.findOne({ email: demo.email.toLowerCase() });
      if (!exists) {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(demo.password, salt);

        const newUser = await User.create({
          name: demo.name,
          email: demo.email.toLowerCase(),
          password: hashedPassword,
          role: demo.role,
          department: demo.department,
        });

        createdUsers.push({
          id: newUser._id.toString(),
          name: newUser.name,
          email: newUser.email,
          role: newUser.role,
          department: newUser.department,
        });
      }
    }

    return NextResponse.json({
      success: true,
      message: `Seeded ${createdUsers.length} new demo accounts.`,
      users: createdUsers,
    });
  } catch (error) {
    console.error('Seed error:', error);
    const message = error instanceof Error ? error.message : 'Failed to seed users';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function GET() {
  return POST();
}
