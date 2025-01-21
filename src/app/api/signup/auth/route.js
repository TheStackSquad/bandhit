// src/app/api/auth/[provider]/route.js
import { NextResponse } from 'next/server';
import dbConnect from '@/utils/dbConnect';
import User from '@/schemas/models/User';
import { OAuth2Client } from 'google-auth-library';

const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

export async function POST(request, { params }) {
  try {
    await dbConnect();
    
    const { provider } = params;
    const body = await request.json();
    
    // Verify the social token and get user info
    const socialUserData = await verifySocialToken(provider, body.token);
    if (!socialUserData) {
      return NextResponse.json(
        { success: false, message: 'Invalid token' },
        { status: 401 }
      );
    }

    // Find or create user
    let user = await User.findOne({
      $or: [
        { email: socialUserData.email },
        { 
          socialAccounts: {
            $elemMatch: {
              provider,
              providerId: socialUserData.providerId
            }
          }
        }
      ]
    });

    if (user) {
      // Update existing user's social accounts if needed
      const hasProvider = user.socialAccounts?.some(
        account => account.provider === provider
      );
      
      if (!hasProvider) {
        user.socialAccounts.push({
          provider,
          providerId: socialUserData.providerId,
          email: socialUserData.email,
          lastUsed: new Date()
        });
        await user.save();
      } else {
        // Update last used timestamp
        await User.updateOne(
          { 
            _id: user._id,
            'socialAccounts.provider': provider 
          },
          { 
            $set: { 'socialAccounts.$.lastUsed': new Date() }
          }
        );
      }
    } else {
      // Create new user
      user = await User.create({
        name: socialUserData.name,
        email: socialUserData.email,
        socialAccounts: [{
          provider,
          providerId: socialUserData.providerId,
          email: socialUserData.email,
          lastUsed: new Date()
        }],
        isAdult: body.isAdult,
        referralSource: body.referralSource
      });
    }

    // Generate session/token
    const session = await createUserSession(user);

    return NextResponse.json({
      success: true,
      message: `Successfully authenticated with ${provider}`,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        socialAccounts: user.socialAccounts.map(acc => ({
          provider: acc.provider,
          email: acc.email
        }))
      },
      session
    });

  } catch (error) {
    console.error(`${params.provider} auth error:`, error);
    return NextResponse.json(
      { success: false, message: 'Authentication failed' },
      { status: 500 }
    );
  }
}

async function verifySocialToken(provider, token) {
  switch (provider) {
    case 'google':
      try {
        const ticket = await googleClient.verifyIdToken({
          idToken: token,
          audience: process.env.GOOGLE_CLIENT_ID
        });
        const payload = ticket.getPayload();
        return {
          providerId: payload.sub,
          name: payload.name,
          email: payload.email,
          picture: payload.picture
        };
      } catch (error) {
        console.error('Google token verification failed:', error);
        return null;
      }
    // Add other providers...
    default:
      return null;
  }
}