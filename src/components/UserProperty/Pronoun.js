import React, { useState } from 'react';
import PropTypes from 'prop-types';
import Input from '@codeday/topo/Atom/Input/Text';
import FormControl, { Label } from '@codeday/topo/Atom/Form';
import Text, { Link } from '@codeday/topo/Atom/Text';
import Radio, { Group, Stack } from '@codeday/topo/Atom/Input/Radio';

const CUSTOM = 'custom';
const defaultPronouns = {
  'she/her': 'she/her',
  'he/him': 'he/him',
  'they/them': 'they/them',
  unspecified: 'prefer not to say',
};

const Pronoun = ({ user, onChange }) => {
  const previousPronoun = user.pronoun;
  const previousWasCustom = !(previousPronoun in defaultPronouns) && previousPronoun;

  const [selection, setSelection] = useState(previousWasCustom ? CUSTOM : previousPronoun);
  const [custom, setCustom] = useState(previousWasCustom ? previousPronoun : '');

  const defaultRadios = Object.keys(defaultPronouns).map((k) => (
    <Radio key={k} value={k}>
      {defaultPronouns[k]}
    </Radio>
  ));

  const customRadio = (
    <Radio key={CUSTOM} value={CUSTOM}>
      {custom || selection === CUSTOM ? (
        <Input
          value={custom}
          onChange={(e) => {
            setSelection(CUSTOM);
            setCustom(e.target.value);
            onChange({ pronoun: e.target.value });
          }}
        />
      ) : (
        <Text color="gray.500" as="span">
          (other)
        </Text>
      )}
    </Radio>
  );

  return (
    <FormControl>
      <Label fontWeight="bold">
        Which pronouns do you use?&nbsp;
        <Link
          color="gray.700"
          fontWeight="normal"
          target="_blank"
          href="https://www.glsen.org/activity/pronouns-guide-glsen"
        >
          <sup>(what&apos;s this?)</sup>
        </Link>
      </Label>
      <Group
        value={selection}
        onChange={(e) => {
          const newSelection = e;
          setSelection(newSelection);
          if (newSelection === CUSTOM) {
            onChange({ pronoun: custom });
          } else {
            onChange({ pronoun: newSelection });
          }
        }}
      >
        <Stack>{[...defaultRadios, customRadio]}</Stack>
      </Group>
    </FormControl>
  );
};
Pronoun.propTypes = {
  user: PropTypes.object.isRequired,
  onChange: PropTypes.func.isRequired,
};
Pronoun.provides = 'pronoun';
export default Pronoun;
