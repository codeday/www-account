import React from 'react';
import Head from 'next/head';
import { Text, Button } from '@codeday/topo/Atom';
import { getSession, signIn } from 'next-auth/client';
import jwt from 'jsonwebtoken';
import Page from '../../components/Page';
import { AddRole, GetAccountProperties } from './[code].gql';
import { tryAuthenticatedApiQuery, tryAuthenticatedServerApiQuery } from '../../util/api';

export const getServerSideProps = async ({ req, params }) => {
  const session = await getSession({ req });

  if (!session || !session.user) {
    return { props: { logIn: true } };
  }

  let success = false;
  const serverToken = jwt.sign({ scopes: 'read:user' }, process.env.GRAPH_SECRET);
  const { result: propsResult, error: propsError } = await tryAuthenticatedServerApiQuery(
    GetAccountProperties,
    { id: session.user.id },
    serverToken,
  );
  // console.log(propsResult, propsError);
  const propsSuccessful = propsResult && !propsError;
  const blocked = propsResult?.account?.getUser?.blocked;

  const userToken = jwt.sign({ id: session.user?.id }, process.env.AUTH0_HOOK_SHARED_SECRET);
  const { result, error } = await tryAuthenticatedApiQuery(AddRole, { code: params.code }, userToken);
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
