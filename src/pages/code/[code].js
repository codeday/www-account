import React from 'react';
import getConfig from 'next/config';
import Head from 'next/head';
import { Text, Button } from '@codeday/topo/Atom';
import { getSession, signIn } from 'next-auth/client';
import jwt from 'jsonwebtoken';
import Page from '../../components/Page';
import { AddRole, GetAccountProperties } from './[code].gql';
import { tryAuthenticatedApiQuery } from '../../util/api';

const { serverRuntimeConfig } = getConfig();

export const getServerSideProps = async ({ req, params }) => {
  const session = await getSession({ req });

  if (!session || !session.user) {
    return { props: { logIn: true } };
  }

  let success = false;
  const token = jwt.sign({ id: session.user?.id }, serverRuntimeConfig.auth0.hookSharedSecret);
  const { result: propsResult, error: propsError } = await tryAuthenticatedApiQuery(GetAccountProperties, {}, token);

  const propsSuccessful = propsResult && !propsError;
  const blocked = propsResult?.account?.getUser?.blocked;

  const { result, error } = await tryAuthenticatedApiQuery(AddRole, { code: params.code }, token);
  const addRoleSuccessful = result && !error;
  if (addRoleSuccessful && propsSuccessful && !blocked) success = true;

  let errorMessage = 'An error occurred. Please log out and try again.';
  if (blocked) {
    errorMessage = 'You have been blocked from volunteering.';
  } else if (!addRoleSuccessful) {
    errorMessage = "That's not a valid role code.";
  }

  return {
    props: {
      errorMessage,
      success,
      cookies: req.headers.cookie,
    },
  };
};

const Success = ({ success, logIn, errorMessage }) => {
  if (logIn) {
    return (
      <Page>
        <Button onClick={() => signIn('auth0')}>Sign in to CodeDay</Button>
      </Page>
    );
  }
  return (
    <Page isLoggedIn>
      <Head>
        <title>Add Code</title>
      </Head>
      <Text>{success ? 'Your role was added.' : errorMessage}</Text>
    </Page>
  );
};
export default Success;
