/* eslint-disable no-param-reassign */
import NextAuth from 'next-auth';
import Providers from 'next-auth/providers';

const options = {
  providers: [
    Providers.Auth0({
      clientId: process.env.AUTH0_CLIENT_ID,
      clientSecret: process.env.AUTH0_CLIENT_SECRET,
      domain: process.env.NEXT_PUBLIC_AUTH0_DOMAIN,
      authorizationUrl: `https://${process.env.NEXT_PUBLIC_AUTH0_DOMAIN}/authorize?response_type=code&prompt=login`,
    }),
  ],
  session: {
    jwt: true,
  },
  callbacks: {
    jwt: async (token, _, account) => {
      if (account?.id) token.id = account.id;
      return Promise.resolve(token);
    },
    session: async (session, user) => {
      session.user.id = user.id;
      return Promise.resolve(session);
    },
  },
};

export default (req, res) => NextAuth(req, res, options);
