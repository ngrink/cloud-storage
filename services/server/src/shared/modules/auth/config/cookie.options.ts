import { CookieOptions } from 'express';

export const refreshCookieOptions: CookieOptions = {
  httpOnly: true,
  secure: false,
  sameSite: 'strict',
  maxAge: 36000000 * 24 * 60,
  path: '/api/v1/auth/refresh',
};
