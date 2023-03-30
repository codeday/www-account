import React from 'react';
import Button from '@codeday/topo/Atom/Button';
import Page from '../../components/Page';

const DiscordError = ({ message }) => {
  return (
    <Page isLoggedIn={false}>
      <p>{message}</p>
      <Button size="xs" href="/" as="a">
        Click here to return to the main page.
      </Button>
    </Page>
  );
};

export default DiscordError;

export const getServerSideProps = async ({ req, res, query }) => {
  if (query.code === 'discordalreadylinked') {
    return {
      props: {
        message: 'ERROR: That Discord account is already linked to a CodeDay account!',
        cookies: req.headers.cookie ?? '',
      },
    };
  }
  if (query.code === 'codedayalreadylinked') {
    return {
      props: {
        message: 'ERROR: Your CodeDay account is already linked to a Discord account!',
        cookies: req.headers.cookie ?? '',
      },
    };
  }
  res.setHeader('location', '/');
  res.statusCode = 302;
  res.end();
  return { props: {} };
};
