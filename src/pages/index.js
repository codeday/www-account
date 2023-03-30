/* eslint-disable react-hooks/rules-of-hooks */
import React, { useState } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { Heading, Divider, Button, Box, Link } from '@codeday/topo/Atom';
import merge from 'deepmerge';
import getConfig from 'next/config';
import jwt from 'jsonwebtoken';
import { getSession, signIn } from 'next-auth/client';
import { useColorMode } from '@codeday/topo/Theme';
import SubmitUpdates from '../components/SubmitUpdates';
import UserProperties from '../components/UserProperties';
import { IndexUserQuery } from './index.gql';
import WelcomeHeader from '../components/WelcomeHeader';
import Page from '../components/Page';
import { tryAuthenticatedApiQuery } from '../util/api';

const { serverRuntimeConfig } = getConfig();

export default function Home({ user, token, logIn }) {
  const [changes, setChanges] = useState({});
  const router = useRouter();
  const { colorMode, toggleColorMode } = useColorMode();

  if (logIn) {
    return (
      <Page>
        <Button onClick={() => signIn('auth0')}>Sign in to CodeDay</Button>
      </Page>
    );
  }
  // @ts-ignore
  if (!user || !user.roles) {
    return (
      <Page>
        {"We couldn't fetch your data! Please refresh the page and try again. If the error persists contact us at "}
        <Link href="https://www.codeday.org/contact">codeday.org/contact</Link>.
      </Page>
    );
  }
  const onSubmit = () => {
    router.replace(router.asPath);
    setChanges({});
  };

  return (
    <Page slug="/" isLoggedIn>
      <Head>
        <title>CodeDay Account</title>
        <link rel="icon" type="image/x-icon" href="/favicon.ico?v=2" />
      </Head>
      <WelcomeHeader user={user} />
      <Divider />
      <Heading as="h2" size="lg" paddingTop={4}>
        Update Your Account
      </Heading>
      <UserProperties
        token={token}
        user={merge(user, changes)}
        fields={[
          'username',
          'picture',
          'familyName',
          'givenName',
          'displayNameFormat',
          'pronoun',
          user.badges ? 'badges' : null,
          'phoneNumber',
          'bio',
          user.roles.find((role) => role.name === 'Volunteer') ? 'title' : null,
          'discord',
        ]}
        onChange={setChanges}
      />
      <Box textAlign="right" marginRight={3}>
        <SubmitUpdates
          token={token}
          user={user}
          changes={changes}
          required={['username', 'givenName', 'familyName', 'pronoun']}
          onSubmit={onSubmit}
        />
        <Box marginTop={3}>
          <Button size="xs" onClick={toggleColorMode} marginRight={1}>
            Toggle {colorMode === 'light' ? 'Dark' : 'Light'}
          </Button>
          <Button as="a" href="/api/password" size="xs">
            Change Password
          </Button>
        </Box>
      </Box>
    </Page>
  );
}

export async function getServerSideProps({ req }) {
  const session = await getSession({ req });
  if (!session || !session.user) {
    return { props: { logIn: true } };
  }
  const token = jwt.sign({ id: session.user?.id }, serverRuntimeConfig.auth0.hookSharedSecret);
  const { result, error } = await tryAuthenticatedApiQuery(IndexUserQuery, {}, token);
  console.log(error);
  if (error) return { props: {} };

  return {
    props: {
      user: result?.account?.getUser || null,
      token,
      cookies: req.headers.cookie,
    },
  };
}
