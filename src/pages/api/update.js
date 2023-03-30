import getConfig from 'next/config';
import jwt from 'jsonwebtoken';
import phone from 'phone';
import { UpdateUserProfileMutation, SetDisplayedBadgesMutation, AddRoleWithCodeMutation } from './update.gql';
import { tryAuthenticatedApiQuery } from '../../util/api';

const { serverRuntimeConfig } = getConfig();

export default async (req, res) => {
  const token = req && req.query && req.query.token;
  const { body } = req;
  const userId = jwt.verify(token, serverRuntimeConfig.auth0.hookSharedSecret).id;

  if (!userId) {
    return res
      .status(400)
      .send({ error: "You don't have permission to do this, please refresh the page and try again." });
  }
  const { _meta, ...updates } = body;
  if (updates.addRole) {
    const { result, error } = await tryAuthenticatedApiQuery(
      AddRoleWithCodeMutation,
      { where: {}, code: updates.addRole },
      token,
    );
    if (error) {
      return res.status(400).send({ error: `${updates.addRole} is not a volunteer code.` });
    }
    delete updates.addRole;
  }
  if (updates.badges) {
    updates.badges = updates.badges.filter((el) => el.displayed);
    const { result, error } = await tryAuthenticatedApiQuery(
      SetDisplayedBadgesMutation,
      { badges: updates.badges.map((badge) => ({ id: badge.id, order: badge.order })) },
      token,
    );
    if (error) {
      return res.status(400).send({ error: 'There was an error while changing your displayed badges.' });
    }
    delete updates.badges;
  }
  if (updates.phoneNumber) {
    [updates.phoneNumber] = phone(updates.phoneNumber);
  }
  if (Object.keys(updates).length > 0) {
    const { result, error } = await tryAuthenticatedApiQuery(
      UpdateUserProfileMutation,
      { updates: { ...updates } },
      token,
    );
    if (error) {
      return res.status(400).send({ error: error.response.errors[0].message });
    }
  }
  return res.send({ ok: true });
};
