import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { FormLabel, FormHelperText, Textarea, FormControl } from '@codeday/topo/Atom';

const Bio = ({ user, onChange }) => {
  const [bio, setBio] = useState(user.bio);
  return (
    <FormControl>
      <FormLabel fontWeight="bold">Share a bio?</FormLabel>
      <Textarea
        value={bio}
        onChange={(e) => {
          setBio(e.target.value);
          onChange({ bio: e.target.value });
        }}
      />
      <FormHelperText>This is sometimes displayed when you&apos;re listed on our websites.</FormHelperText>
    </FormControl>
  );
};
Bio.propTypes = {
  user: PropTypes.object.isRequired,
  onChange: PropTypes.func.isRequired,
};
Bio.provides = 'bio';
export default Bio;
