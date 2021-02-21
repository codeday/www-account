import React, { useState } from 'react';
import PropTypes from 'prop-types';
import TextArea from '@codeday/topo/Atom/Input/Textarea';
import FormControl, { Label, HelpText } from '@codeday/topo/Molecule/FormControl'

const Bio = ({ user, onChange }) => {
  const [bio, setBio] = useState(user.bio);

  return (
    <FormControl>
      <Label fontWeight="bold">Share a bio?</Label>
      <TextArea
        value={bio}
        onChange={(e) => {
          setBio(e.target.value);
          onChange({ bio: e.target.value });
        }}
      />
      <HelpText>
        This is sometimes displayed when you&apos;re listed on our websites.
      </HelpText>
    </FormControl>
  );
};
Bio.propTypes = {
  user: PropTypes.object.isRequired,
  onChange: PropTypes.func.isRequired,
};
Bio.provides = 'bio';
export default Bio;