import { verify } from 'jsonwebtoken';
import { getAuthSecret } from './secrets';

export const authorize = (req: Request): boolean => {
  const authHeader = req.headers.get('Authorization');

  if (!authHeader) {
    return false;
  }

  const token = authHeader.split(' ')[1];

  if (!token) {
    return false;
  }

  try {
    const payload = verify(token, getAuthSecret(), {
      algorithms: ['HS256'],
    });

    if (!payload || typeof payload === "string") {
      return false;
    }

    if (payload.exp && Date.now() >= payload.exp * 1000) {
      return false;
    }

    return true;
  } catch (error) {
    console.error(error);
    return false;
  }
};
