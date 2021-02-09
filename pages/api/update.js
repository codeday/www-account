/* eslint-disable no-underscore-dangle */
/* eslint-disable prefer-destructuring */
import phone from 'phone';
import getConfig from 'next/config';
import loginApi from '../../lib/login';
import { managementApi } from '../../lib/auth0';
import { userFromJwt } from '../../utils/profile';

const { serverRuntimeConfig } = getConfig();

const clearUndefined = (obj) => {
  // eslint-disable-next-line no-param-reassign
  Object.keys(obj).forEach((key) => obj[key] === undefined && delete obj[key]);
  return obj;
};

const formatName = (format, given, family) => {
  if (format === 'initials') return `${given ? given[0].toUpperCase() : ''}${family ? family[0].toUpperCase() : ''}`;
  if (format === 'given') return given;
  if (format === 'short') return `${given}${family ? ` ${family[0].toUpperCase()}` : ''}`;
  return `${given} ${family}`;
};

// eslint-disable-next-line sonarjs/cognitive-complexity
const cleanUpdates = (originalUser, existingRoles, originalBody) => {
  const body = JSON.parse(JSON.stringify(originalBody));
  const user = JSON.parse(JSON.stringify(originalUser));
  if (!body.user_metadata) body.user_metadata = {};
  if (!user.user_metadata) user.user_metadata = {};
  const roles = [];

  // Is the user trying to remove their name?
  if (user.given_name && !body.given_name && typeof body.given_name !== 'undefined') {
    throw new Error('Name is required.');
  }
  if (user.family_name && !body.family_name && typeof body.family_name !== 'undefined') {
    throw new Error('Name is required.');
  }

  // Has the user already accepted the TOS?
  if (body.user_metadata.accept_tos !== null && typeof body.user_metadata.accept_tos !== 'undefined') {
    body.user_metadata.accept_tos = Boolean(body.user_metadata.accept_tos);
    if (user.user_metadata.accept_tos) throw new Error('You have already accepted the TOS.');
  }

  // Check the username
  if (body.username && user.username) delete body.username;
  if (body.username && body.username !== body.username.replace(/[^a-zA-Z0-9\-_]/g, '')) {
    throw new Error('Username can only consist of letters, numbers, and _ or -.');
  }

  // Check that the picture is from our domain
  if (body.picture && body.picture.indexOf(serverRuntimeConfig.uploader.allowedUrlPrefix) !== 0) {
    throw new Error(`Picture must be hosted on ${serverRuntimeConfig.uploader.allowedUrlPrefix}.`);
  }

  // Check and normalize the phone number
  if (body.user_metadata.phone_number) {
    body.user_metadata.phone_number = phone(body.user_metadata.phone_number)[0];
  }

  // Check if they should become a volunteer
  if (body._meta && body._meta.volunteer_code) {
    if (serverRuntimeConfig.volunteerCode.split(/,/g).includes(body._meta.volunteer_code)) {
      roles.push(serverRuntimeConfig.auth0.volunteerRole);
    } else if (serverRuntimeConfig.mentorCode.split(/,/g).includes(body._meta.volunteer_code)) {
      roles.push(serverRuntimeConfig.auth0.mentorRole);
    } else throw new Error(`${body._meta.volunteer_code} is not a volunteer code.`);
  }

  // If we're changing the given_name or family_name, also update name, otherwise disable name changes.
  if (body.given_name || body.family_name || body.user_metadata.display_name_format) {
    body.name = formatName(
      body.user_metadata.display_name_format || 'short',
      body.given_name || user.given_name,
      body.family_name || user.family_name
    );
  } else delete body.name;

  // Only volunteers can set titles.
  if (roles.includes(serverRuntimeConfig.auth0.volunteerRole)
        || existingRoles.map((r) => r.id).includes(serverRuntimeConfig.auth0.volunteerRole)) {
    if (!body.user_metadata.title && !user.user_metadata.title) {
      body.user_metadata.title = 'Volunteer';
    }
  } else {
    body.user_metadata.title = null;
  }

  const metadata = clearUndefined(Object.keys(body.user_metadata)
    .filter((k) => ['pronoun', 'accept_tos', 'phone_number', 'display_name_format', 'title', 'bio'].includes(k))
    // eslint-disable-next-line no-param-reassign
    .reduce((accum, k) => { accum[k] = body.user_metadata[k]; return accum; }, {}));

  const data = clearUndefined(Object.keys(body)
    .filter((k) => ['username', 'given_name', 'family_name', 'name', 'picture'].includes(k))
    // eslint-disable-next-line no-param-reassign
    .reduce((accum, k) => { accum[k] = body[k]; return accum; }, {}));

  return { data, metadata, roles };
};

export default async (req, res) => {
  const jwt = req && req.query && req.query.token;
  const { body } = req;
  const userId = jwt
    ? userFromJwt(jwt).user_id
    : (await loginApi.getSession(req)).user.sub;

  const [user, userRoles] = await Promise.all([
    managementApi.getUser({ id: userId }),
    managementApi.getUserRoles({ id: userId }),
  ]);

  // Get the updates
  let data;
  let metadata;
  let roles;
  try {
    ({ data, metadata, roles } = cleanUpdates(user, userRoles, body));
  } catch (ex) {
    return res.status(400).send({ error: ex.message });
  }

  try {
    if (Object.keys(data).length > 0) {
      await managementApi.updateUser({ id: userId }, data);
    }
    if (Object.keys(metadata).length > 0) {
      await managementApi.updateUserMetadata({ id: userId }, {
        ...user.metadata,
        ...metadata,
      });
    }
    if (Object.keys(roles).length > 0) {
      await managementApi.assignRolestoUser({ id: userId }, { roles });
    }

    return res.send({ ok: true });
  } catch (ex) {
    // eslint-disable-next-line no-console
    console.error(ex.message);
    return res.status(500).send({ error: 'Could not update your profile.' });
  }
};