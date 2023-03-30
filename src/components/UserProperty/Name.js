import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Grid, TextInput, FormControl, FormLabel } from '@codeday/topo/Atom';

const Name = ({ user, onChange }) => {
  const [familyName, setFamilyName] = useState(user.familyName);
  const [givenName, setGivenName] = useState(user.givenName);

  return (
    <FormControl>
      <FormLabel fontWeight="bold">What name would you like to go by?</FormLabel>
      <Grid templateColumns="1fr 1fr" gap={2}>
        <TextInput
          value={givenName}
          placeholder="First Name"
          id="firstname"
          onChange={(e) => {
            setGivenName(e.target.value);
            onChange({ givenName: e.target.value, familyName });
          }}
        />
        <TextInput
          value={familyName}
          placeholder="Last Name"
          id="lastname"
          onChange={(e) => {
            setFamilyName(e.target.value);
            onChange({ givenName, familyName: e.target.value });
          }}
        />
      </Grid>
    </FormControl>
  );
};
Name.propTypes = {
  user: PropTypes.object.isRequired,
  onChange: PropTypes.func.isRequired,
};
Name.provides = ['familyName', 'givenName'];
export default Name;
