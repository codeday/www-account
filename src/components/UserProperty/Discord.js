import React, { useState } from 'react';
import PropTypes from 'prop-types';
import {
  FormControl,
  FormLabel,
  FormHelperText,
  Image,
  Box,
  Text,
  Button,
  Link,
  Popover,
  PopoverTrigger,
  PopoverArrow,
  PopoverContent,
  PopoverHeader,
  PopoverCloseButton,
  PopoverBody,
} from '@codeday/topo/Atom';
import { useRouter } from 'next/router';
import { useToasts } from '@codeday/topo/utils';
import { tryAuthenticatedApiQuery } from '../../util/api';
import { UnlinkDiscordMutation } from './Discord.gql';

const unlinkDiscord = async (token) => {
  const { error } = await tryAuthenticatedApiQuery(UnlinkDiscordMutation, {}, token);
  return !error;
};

const Discord = ({ user, token }) => {
  const [isLinked, setIsLinked] = useState(!!user.discordId);
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);
  const router = useRouter();
  const { success } = useToasts();
  const picture = user?.discordInformation?.avatar.endsWith('null')
    ? `https://cdn.discordapp.com/embed/avatars/${user.discordInformation.discriminator % 5}.png`
    : user?.discordInformation?.avatar || null;

  return (
    <FormControl>
      <FormLabel fontWeight="bold">Discord Information</FormLabel>
      {isLinked ? (
        <Box>
          <Box style={{ clear: 'both', display: 'flex', alignItems: 'center' }}>
            <Image mb={2} src={picture} alt="" float="left" mr={2} height="2em" rounded="full" />{' '}
            <Text fontSize="1em">{user.discordInformation.handle}</Text>
          </Box>
          <Popover isOpen={isPopoverOpen} onOpen={() => setIsPopoverOpen(true)} onClose={() => setIsPopoverOpen(false)}>
            <PopoverTrigger>
              <Button size="xs" marginRight="3">
                Unlink Discord account
              </Button>
            </PopoverTrigger>
            <PopoverContent>
              <PopoverArrow />
              <PopoverCloseButton />
              <PopoverHeader>Confirmation!</PopoverHeader>
              <PopoverBody>
                <p>Are you sure you want to do that?</p>
                <Button
                  size="xs"
                  style={{ width: '50%' }}
                  onClick={async () => {
                    await unlinkDiscord(token);
                    setIsLinked(false);
                    success('Unlinked Discord Account!');
                  }}
                >
                  Yes
                </Button>
                <Button size="xs" bg="red.600" style={{ width: '50%' }} onClick={() => setIsPopoverOpen(false)}>
                  No
                </Button>
              </PopoverBody>
            </PopoverContent>
          </Popover>
          <FormHelperText>
            Your account is linked and ready! Make sure you are in the{' '}
            <Link href="https://discord.gg/codeday">CodeDay Discord Server</Link>!
          </FormHelperText>
        </Box>
      ) : (
        <Box>
          <Button onClick={() => router.push('/api/discord/link')}>Link Discord</Button>
          <FormHelperText>
            Link your Discord account to get full access to the{' '}
            <Link href="https://discord.gg/codeday">CodeDay Discord Server</Link>.
          </FormHelperText>
        </Box>
      )}
    </FormControl>
  );
};
Discord.propTypes = {
  user: PropTypes.object.isRequired,
  token: PropTypes.string.isRequired,
};
Discord.provides = 'discord';
export default Discord;
