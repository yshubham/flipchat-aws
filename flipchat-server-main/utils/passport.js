import passport from 'passport';
import passportGoogle from 'passport-google-oauth20';
import dotenv from "dotenv";

dotenv.config();

const GoogleStrategy = passportGoogle.Strategy;

export function useGoogleStrategy() {
    // Get the server base URL from environment or construct from domain
    const SERVER_BASE_URL = process.env.SERVER_BASE_URL || process.env.CLIENT_BASE_URL?.replace(/\/$/, '') || 'https://pbhfinal.shop';
    const callbackURL = `${SERVER_BASE_URL}/api/auth/google/callback`;
    
    passport.use(
        new GoogleStrategy(
            {
                clientID: process.env.GOOGLE_CLIENT_ID || '',
                clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
                callbackURL: callbackURL,
                scope: ['profile', 'email']
            },
            async (accessToken, refreshToken, profile, callback) => {
                callback(null, profile)
            }
        )
    );

    passport.serializeUser(function (user, done) {
        done(null, user);
    });

    passport.deserializeUser(function (user, done) {
        done(null, user);
    });
}