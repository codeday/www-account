import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Text, FormControl, FormLabel, FormHelperText, TextInput } from '@codeday/topo/Atom';

const Phone = ({ user, onChange }) => {
  const [phoneNumber, setPhoneNumber] = useState(user.phoneNumber);

  return (
    <FormControl>
      <FormLabel fontWeight="bold">What is your phone number?</FormLabel>
      <TextInput
        value={phoneNumber}
        onChange={(e) => {
          setPhoneNumber(e.target.value);
          onChange({ phoneNumber: e.target.value });
        }}
      />
      <FormHelperText>
        We mostly use this if you&apos;re a volunteer, to get in touch during events. If you have two-factor
        authentication turned on, this will <Text as="em">not</Text> change the associated phone number.
      </FormHelperText>
    </FormControl>
  );
};
Phone.propTypes = {
  user: PropTypes.object.isRequired,
  onChange: PropTypes.func.isRequired,
};
Phone.provides = 'phoneNumber';
export default Phone;
