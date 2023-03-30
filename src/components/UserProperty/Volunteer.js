import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { TextInput, Button, FormControl, FormLabel, FormHelperText } from '@codeday/topo/Atom';
import { Collapse } from '@codeday/topo/Molecule';

const Volunteer = ({ user, onChange }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [volunteerCode, setVolunteerCode] = useState('');

  if (user.roles.find((role) => role.name === 'Mentor' || role.name === 'Volunteer')) return <></>;

  return (
    <FormControl>
      <FormLabel fontWeight="bold">
        {!isVisible ? `Are you a volunteer?` : `What's your volunteer access code?`}
      </FormLabel>
      <Collapse in={!isVisible}>
        <Button size="xs" variant="outline" onClick={() => setIsVisible(true)}>
          Yes, I&apos;m a volunteer!
        </Button>
      </Collapse>
      <Collapse in={isVisible}>
        <TextInput
          value={volunteerCode}
          onChange={(e) => {
            setVolunteerCode(e.target.value);
            onChange({ addRole: e.target.value });
          }}
        />
        <FormHelperText>You can get this from your staff contact.</FormHelperText>
      </Collapse>
    </FormControl>
  );
};
Volunteer.propTypes = {
  user: PropTypes.object.isRequired,
  onChange: PropTypes.func.isRequired,
};
Volunteer.provides = ['volunteer', 'addRole'];
export default Volunteer;
