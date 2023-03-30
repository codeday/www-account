/* eslint-disable no-console */
import { getSession } from 'next-auth/client';
import { managementApi } from '../../lib/auth0';

export default async (req, res) => {
  const { id } = (await getSession({ req })).user;
  const ticket = await managementApi.createPasswordChangeTicket({
    user_id: id,
    result_url: process.env.NEXT_PUBLIC_APP_URL,
  });
  return res.writeHead(302, { Location: ticket.ticket }).send(ticket.ticket);
};
