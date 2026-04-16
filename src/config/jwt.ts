export const JWT_CONFIG = {
  secret: process.env.JWT_SECRET || 'your-secret-key-change-in-production',
  accessTokenExpiry: '15m',
  refreshTokenExpiry: '7d',
  saltRounds: 12,
} as const;