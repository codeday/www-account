import React, { useState } from 'react';
import PropTypes from 'prop-types';
import merge from 'deepmerge';
import { Button } from '@codeday/topo/Atom';
import { useToasts } from '@codeday/topo/utils';
import { submitUserChanges } from '../util/profile';

const hasRequired = (required, user, changes) => {
  const merged = merge(user, changes);
  const missing = required.map((str) => {
    try {
      return str.split('.').reduce((o, i) => o[i], merged) || false;
    } catch (ex) {
      return false;
    }
  });
  return missing.filter((res) => !res).length === 0;
};

const SubmitUpdates = ({ changes, user, required, onSubmit, token, children }) => {
  const [isLoading, setIsLoading] = useState(false);
  const { success, error } = useToasts();
  const { _meta, ...cleanChanges } = changes;
  const { payoutsEligible, ...eligibleChanges } = changes;

  return (
    <Button
      colorScheme="green"
      isDisabled={!changes || Object.keys(changes).length === 0 || !hasRequired(required, user, changes)}
      isLoading={isLoading}
      onClick={async () => {
        if (isLoading) return;
        setIsLoading(true);
        try {
          if (eligibleChanges && Object.keys(eligibleChanges).length > 0) {
            await submitUserChanges(eligibleChanges, token);
            success('Changes Saved!');
          }
          onSubmit();
        } catch (err) {
          error(err.errors ? err?.errors[0]?.data?.message : err?.message);
        }
        setIsLoading(false);
      }}
    >
      {children || 'Update Profile'}
    </Button>
  );
};
SubmitUpdates.propTypes = {
  required: PropTypes.arrayOf(PropTypes.string),
  user: PropTypes.object.isRequired,
  changes: PropTypes.object.isRequired,
  onSubmit: PropTypes.func,
};
SubmitUpdates.defaultProps = {
  required: [],
  onSubmit: () => {},
};
export default SubmitUpdates;
