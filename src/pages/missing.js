import React, { useReducer } from 'react';
import PropTypes from 'prop-types';
import Head from 'next/head';
import { Box, Text, Link } from '@codeday/topo/Atom';
// import PartyPopper from '@codeday/topocons/Emoji/Objects/PartyPopper';
import merge from 'deepmerge';
import jwt from 'jsonwebtoken';
import { teamRoles, featuredTeamRoles, payoutsEligibleRole } from '../roles';
import Page from '../components/Page';
import ProfileBlocks from '../components/UserProperties';
import SubmitUpdates from '../components/SubmitUpdates';
import { userFromJwt } from '../util/profile';
import { tryAuthenticatedApiQuery } from '../util/api';
import { MissingUserQuery } from './missing.gql';

const Missing = ({ user, state, domain, token }) => {
  const [changes, setChanges] = useReducer((_prev, arg) => ({ ..._prev, ...arg }), {});

  if (!user || !user.roles) {
    return (
      <Page>
        {"We couldn't fetch your data! Please refresh the page and try again. If the error persists contact us at "}
        <Link href="https://www.codeday.org/contact">codeday.org/contact</Link>.
      </Page>
    );
  }

  const missingInfo = [];
  if (!user.username) missingInfo.push('username');
  if (!user.givenName) missingInfo.push('givenName');
  if (!user.familyName) missingInfo.push('familyName');
  if (!user.displayNameFormat) missingInfo.push('displayNameFormat');
  if (!user.pronoun) missingInfo.push('pronoun');
  if (!user.acceptTos) missingInfo.push('acceptTos');
  // eslint-disable-next-line sonarjs/no-collapsible-if
  if (user.roles) {
    if (user.roles.find((role) => role.id === payoutsEligibleRole)) {
      if (!user.payoutsEligible) missingInfo.push('payoutsEligible');
    }
    if (user.roles.find((role) => teamRoles.includes(role.name))) {
      if (!user.phoneNumber) missingInfo.push('phoneNumber');
      if (!user.title) missingInfo.push('title');
    }
    if (user.roles.find((role) => featuredTeamRoles.includes(role.name))) {
      if (!user.bio) missingInfo.push('bio');
    }
  }

  return (
    <Page>
      <Head>
        <title>Missing Info ~ CodeDay Account</title>
      </Head>
      <Text marginTop={0}>
        🎉 Welcome to the CodeDay community,{' '}
        <Text as="span" bold>
          {user.name}!
        </Text>{' '}
        We just need a few more pieces of information from you:
      </Text>
      <ProfileBlocks
        token={token}
        user={merge(user, changes)}
        onChange={setChanges}
        fields={missingInfo}
      />
      <Box textAlign="right">
        <SubmitUpdates
          required={missingInfo.filter((e) => e !== 'volunteer')}
          token={token}
          username={user.username}
          user={user}
          changes={changes}
          onSubmit={() => {
            // eslint-disable-next-line no-undef
            window.location.href = `https://${domain}/continue?state=${state}`;
          }}
        >
          Continue
        </SubmitUpdates>
      </Box>
    </Page>
  );
};
Missing.propTypes = {
  user: PropTypes.object.isRequired,
  state: PropTypes.string.isRequired,
  token: PropTypes.string.isRequired,
};
export default Missing;

export const getServerSideProps = async ({ req, query }) => {
  const jwtUser = userFromJwt(query.token);

  const token = jwt.sign({ id: jwtUser?.sub }, process.env.AUTH0_HOOK_SHARED_SECRET);
  const { result, error } = await tryAuthenticatedApiQuery(MissingUserQuery, { id: jwtUser.sub }, token);
  if (error) return { props: {} };
  return {
    props: {
      user: result.account.getUser,
      state: query.state,
      domain: process.env.NEXT_PUBLIC_AUTH0_DOMAIN,
      token,
      cookies: req.headers.cookie || null,
    },
  };
};
