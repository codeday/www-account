// import axios from 'axios';
import jwt from 'jsonwebtoken';
import axios from 'axios';

export const submitUserChanges = async (changes, token) =>
  axios.post(`/api/update${token ? `?token=${encodeURIComponent(token)}` : ''}`, changes);

export const userFromJwt = (token) => jwt.verify(token, process.env.AUTH0_HOOK_SHARED_SECRET);
