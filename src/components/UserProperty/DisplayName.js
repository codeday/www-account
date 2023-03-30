import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Grid, Radio, RadioGroup, Stack, FormControl, FormLabel } from '@codeday/topo/Atom';

const DisplayName = ({ user, onChange }) => {
  const [displayNameFormat, setDisplayNameFormat] = useState(user.displayNameFormat);

  return (
    <FormControl>
      <FormLabel fontWeight="bold">How would you like your name displayed in public?</FormLabel>
      <Grid templateColumns="1fr 1fr" gap={2}>
        <RadioGroup
          value={displayNameFormat}
          onChange={(e) => {
            setDisplayNameFormat(e);
            onChange({ displayNameFormat: e });
          }}
        >
          <Stack>
            <Radio value="initials">
              {user.givenName ? user.givenName[0].toUpperCase() : 'First Initial'}{' '}
              {user.familyName ? user.familyName[0].toUpperCase() : 'Last Initial'}
            </Radio>
            <Radio value="given">{user.givenName || 'First Name'}</Radio>
            <Radio value="short">
              {user.givenName || 'First Name'} {user.familyName ? user.familyName[0].toUpperCase() : 'Last Initial'}
            </Radio>
            <Radio value="full">
              {user.givenName || 'First Name'} {user.familyName || 'Last Name'}
            </Radio>
          </Stack>
        </RadioGroup>
      </Grid>
    </FormControl>
  );
};
DisplayName.propTypes = {
  user: PropTypes.object.isRequired,
  onChange: PropTypes.func.isRequired,
};
DisplayName.provides = ['displayNameFormat'];
export default DisplayName;
