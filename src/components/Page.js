import React from 'react';
import PropTypes from 'prop-types';
import { Door } from '@codeday/topocons';
import { Button, Box, Divider, Text, CodeDay, Link } from '@codeday/topo/Atom';
import { Header, Menu, SiteLogo } from '@codeday/topo/Organism';
import { signOut } from 'next-auth/client';
import getConfig from 'next/config';

const { publicRuntimeConfig } = getConfig();

const Page = ({ children, isLoggedIn }) => {
  return (
    <Box margin="1rem auto" maxWidth="600px" width="100%" rounded="sm" borderWidth="1px" marginTop="4" padding={0}>
      <Box padding={3} margin={0}>
        <Header noPadding>
          <SiteLogo>
            <a href="https://www.codeday.org/">
              <CodeDay withText />
            </a>
            <Link href="/">
              <Text
                as="span"
                d="inline"
                letterSpacing="-2px"
                fontFamily="heading"
                position="relative"
                top={1}
                ml={1}
                textDecoration="underline"
                bold
              >
                Account
              </Text>
            </Link>
          </SiteLogo>
          <Menu>
            {isLoggedIn && (
              <Button onClick={() => signOut({ callbackUrl: `${publicRuntimeConfig.appUrl}/logout` })}>
                <Door />
              </Button>
            )}
          </Menu>
        </Header>
      </Box>
      <Divider marginTop={0} />
      <Box padding={3} paddingBottom={5}>
        {children}
      </Box>
    </Box>
  );
};
Page.propTypes = {
  isLoggedIn: PropTypes.bool,
  children: PropTypes.oneOfType([PropTypes.element, PropTypes.arrayOf(PropTypes.element)]).isRequired,
};
Page.defaultProps = {
  isLoggedIn: false,
};
export default Page;
