import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { TextInput, Radio, RadioGroup, Stack, Text, Link, FormControl, FormLabel } from '@codeday/topo/Atom';

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
        <TextInput
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
      <FormLabel fontWeight="bold">
        Which pronouns do you use?&nbsp;
        <Link
          color="gray.700"
          fontWeight="normal"
          target="_blank"
          href="https://www.glsen.org/activity/pronouns-guide-glsen"
        >
          <sup>(what&apos;s this?)</sup>
        </Link>
      </FormLabel>
      <RadioGroup
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
      </RadioGroup>
    </FormControl>
  );
};
Pronoun.propTypes = {
  user: PropTypes.object.isRequired,
  onChange: PropTypes.func.isRequired,
};
Pronoun.provides = 'pronoun';
export default Pronoun;
