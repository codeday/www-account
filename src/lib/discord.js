import OAuth from 'discord-oauth2';

export const discordApi = new OAuth({
  version: 'v8',
  clientId: process.env.DISCORD_CLIENT_ID,
  clientSecret: process.env.DISCORD_CLIENT_SECRET,
  redirectUri: process.env.DISCORD_CLIENT_URI,
});
