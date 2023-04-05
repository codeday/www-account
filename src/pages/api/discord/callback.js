/* eslint-disable no-console */
import { getSession } from 'next-auth/client';
import jwt from 'jsonwebtoken';
import { LinkDiscordMutation, CheckCodeDayLinked, SetDiscordToken } from './discord.gql';
import { tryAuthenticatedAdminApiQuery } from '../../../util/api';
import { discordApi } from '../../../lib/discord';

export default async (req, res) => {
  const { code } = req.query;
  const {
    access_token: accessToken,
    token_type: tokenType,
    expires_in: expiresIn,
    refresh_token: refreshToken,
    scope,
  } = await discordApi.tokenRequest({
    code,
    scope: ['identify', 'guilds', 'role_connections.write'],
    grantType: 'authorization_code',
  });
  console.log(accessToken, tokenType, expiresIn, refreshToken, scope);
  const token = jwt.sign({ t: 'A' }, process.env.GRAPH_SECRET, { expiresIn: '1m' });
  const { id: discordId } = await discordApi.getUser(accessToken);

  const userId = await (await getSession({ req })).user.id;

  const { result: isTokenSet, error: err } = await tryAuthenticatedAdminApiQuery(
    SetDiscordToken,
    {
      where: { id: userId },
      tokenInfo: { accessToken, refreshToken, expiresIn, tokenType, scope },
    },
    token,
  );
  if (!isTokenSet?.account?.setDiscordToken) return res.redirect('/discord/error?code=errorpleasetryagain');
  
  const { result, error } = await tryAuthenticatedAdminApiQuery(CheckCodeDayLinked, { discordId });
  if (result.account.getUser) {
    res.redirect('/discord/error?code=discordalreadylinked');
    return;
  }
  await tryAuthenticatedAdminApiQuery(LinkDiscordMutation, { discordId, userId }, token);

  res.redirect(`/discord/success`);
};
