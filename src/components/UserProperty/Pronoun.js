import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Box, TextInput, Radio, RadioGroup, Stack, Text, Link, FormControl, FormLabel, Flex } from '@codeday/topo/Atom';

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
  const ref = React.useRef();
  const defaultRadios = Object.keys(defaultPronouns).map((k) => (
    <Radio key={k} value={k}>
      {defaultPronouns[k]}
    </Radio>
  ));

  const customRadio = (
    <Flex as="span" onClick={() => ref.current.click()}>
      <Radio key={CUSTOM} value={CUSTOM} ref={ref}>
        {' '}
      </Radio>
      {custom || selection === CUSTOM ? (
        <TextInput
          w="auto"
          value={custom}
          onChange={(e) => {
            setCustom(e.target.value);
            onChange({ pronoun: e.target.value });
            setSelection(CUSTOM);
          }}
        />
      ) : (
        <Text color="gray.500" as="span">
          (other)
        </Text>
      )}
    </Flex>
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
