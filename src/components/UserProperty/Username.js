import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { TextInput, FormControl, FormLabel, FormHelperText } from '@codeday/topo/Atom';

const Username = ({ user, onChange }) => {
  const [username, setUsername] = useState(user.username);
  return (
    <FormControl>
      <FormLabel fontWeight="bold">Username</FormLabel>
      <TextInput
        value={username}
        isDisabled={user.username}
        onChange={(e) => {
          const sanitizedUsername = e.target.value.replace(/[^a-zA-Z0-9\-_]/g, '');
          setUsername(sanitizedUsername);
          onChange({ username: sanitizedUsername });
        }}
      />
      <FormHelperText>
        {user.username ? `Sorry, you can't change your username.` : `You can't change this later, so choose wisely!`}
      </FormHelperText>
    </FormControl>
  );
};
Username.propTypes = {
  user: PropTypes.object.isRequired,
  onChange: PropTypes.func.isRequired,
};
Username.provides = 'username';
export default Username;
