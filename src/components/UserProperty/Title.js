import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { TextInput, FormControl, FormLabel, FormHelperText } from '@codeday/topo/Atom';

const Title = ({ user, onChange }) => {
  const [title, setTitle] = useState(user.title || 'Volunteer');

  return (
    <FormControl>
      <FormLabel fontWeight="bold">What&apos;s your role here?</FormLabel>
      <TextInput
        value={title}
        onChange={(e) => {
          setTitle(e.target.value);
          onChange({ title: e.target.value });
        }}
      />
      <FormHelperText>
        This is usually something like &ldquo;Mentor&rdquo; or just &ldquo;Volunteer&rdquo;. If you have a special title
        you&apos;ll usually be told this by your manager.
      </FormHelperText>
    </FormControl>
  );
};
Title.propTypes = {
  user: PropTypes.object.isRequired,
  onChange: PropTypes.func.isRequired,
};
Title.provides = 'title';
export default Title;
