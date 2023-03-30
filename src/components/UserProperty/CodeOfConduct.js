import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Checkbox, FormControl, FormLabel, FormHelperText, Text, Link, List, ListItem } from '@codeday/topo/Atom';

const CodeOfConduct = ({ user, onChange }) => {
  const [checked, setChecked] = useState(!!user.acceptTos);

  return (
    <FormControl>
      <FormLabel fontWeight="bold">Help us help you help us all:</FormLabel>
      <Text>To make our community as welcoming as possible, we need your help:</Text>
      <List styleType="disc">
        <ListItem>Please be friendly and welcoming.</ListItem>
        <ListItem>Keep things safe and legal.</ListItem>
        <ListItem>Community members may not harass others.</ListItem>
      </List>
      <Text>
        The full Code of Conduct is available at{' '}
        <Link href="https://codeday.to/conduct" target="_blank">
          codeday.to/conduct
        </Link>
        .
      </Text>
      <Checkbox
        marginTop={3}
        onChange={(e) => {
          setChecked(e.target.checked);
          onChange({ acceptTos: e.target.checked });
        }}
        isDisabled={user.acceptTos}
        isChecked={checked}
      >
        I agree to the Code of Conduct
      </Checkbox>
      <FormHelperText>
        If you ever have a problem with another member of the community, you can talk to any member of our staff, or
        email us. More info on how to reach us is available at codeday.to/conduct.
      </FormHelperText>
    </FormControl>
  );
};
CodeOfConduct.propTypes = {
  user: PropTypes.object.isRequired,
  onChange: PropTypes.func.isRequired,
};
CodeOfConduct.provides = 'acceptTos';
export default CodeOfConduct;
