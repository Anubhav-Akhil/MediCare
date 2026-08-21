import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import connectToDatabase from '@/lib/mongodb';
import User from '@/models/User';
import { signToken, AUTH_COOKIE_NAME } from '@/lib/auth';

const DEMO_FALLBACK_ACCOUNTS = [
  {
    id: 'demo_doctor_01',
    email: 'doctor@medicare.com',
    password: 'password123',
    name: 'Dr. Rajesh Kumar',
    role: 'Doctor' as const,
    department: 'Cardiology',
  },
  {
    id: 'demo_admin_01',
    email: 'admin@medicare.com',
    password: 'password123',
    name: 'Admin User',
    role: 'Admin' as const,
    department: 'Hospital Administration',
  },
  {
    id: 'demo_doctor_02',
    email: 'sunita.verma@medicare.com',
    password: 'password123',
    name: 'Dr. Sunita Verma',
    role: 'Doctor' as const,
    department: 'Dermatology',
  },
];

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, password } = body;

    // Validate inputs
    if (!email || !password) {
      return NextResponse.json(
        { error: 'Please provide both email and password.' },
        { status: 400 }
      );
    }

    const normalizedEmail = email.toLowerCase().trim();

    // Try MongoDB authentication first
    try {
      await connectToDatabase();

      // Find user in MongoDB
      const user = await User.findOne({ email: normalizedEmail });

      if (user) {
        // Verify password
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
          return NextResponse.json(
            { error: 'Invalid email or password.' },
            { status: 401 }
          );
        }

        // Sign JWT Token
        const userPayload = {
          id: user._id.toString(),
          email: user.email,
          name: user.name,
          role: user.role,
          department: user.department,
        };

        const token = await signToken(userPayload);

        const response = NextResponse.json({
          success: true,
          message: 'Login successful.',
          user: {
            id: user._id.toString(),
            name: user.name,
            email: user.email,
            role: user.role,
            department: user.department,
            createdAt: user.createdAt?.toISOString() || new Date().toISOString(),
          },
        });

        response.cookies.set({
          name: AUTH_COOKIE_NAME,
          value: token,
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'lax',
          path: '/',
          maxAge: 7 * 24 * 60 * 60,
        });

        return response;
      }
    } catch (dbError) {
      console.warn('[Auth API] MongoDB connection issue during login:', dbError);
    }

    // Demo user fallback: if MongoDB is offline or user was not in DB yet
    const demoAccount = DEMO_FALLBACK_ACCOUNTS.find(
      (acc) => acc.email.toLowerCase() === normalizedEmail && acc.password === password
    );

    if (demoAccount) {
      const userPayload = {
        id: demoAccount.id,
        email: demoAccount.email,
        name: demoAccount.name,
        role: demoAccount.role,
        department: demoAccount.department,
      };

      const token = await signToken(userPayload);

      const response = NextResponse.json({
        success: true,
        message: 'Login successful (demo session).',
        user: {
          id: demoAccount.id,
          name: demoAccount.name,
          email: demoAccount.email,
          role: demoAccount.role,
          department: demoAccount.department,
          createdAt: new Date().toISOString(),
        },
      });

      response.cookies.set({
        name: AUTH_COOKIE_NAME,
        value: token,
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
        maxAge: 7 * 24 * 60 * 60,
      });

      return response;
    }

    return NextResponse.json(
      { error: 'Invalid email or password.' },
      { status: 401 }
    );
  } catch (error: unknown) {
    console.error('Login error:', error);
    let message = 'Server error occurred during login.';
    if (error instanceof Error) {
      if (error.name === 'MongooseServerSelectionError' || error.message.includes('ECONNREFUSED')) {
        message = 'Could not connect to MongoDB. Please ensure MongoDB is running or configure your MONGODB_URI in .env.local.';
      } else {
        message = error.message;
      }
    }
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

