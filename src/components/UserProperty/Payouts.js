import React, { useState } from 'react';
import PropTypes from 'prop-types';
import {
  FormControl,
  FormLabel,
  FormHelperText,
  Button,
  Text,
} from '@codeday/topo/Atom';
import ConfirmAll from '../ConfirmAll';
import { tryAuthenticatedApiQuery } from '../../util/api';
import { PayoutsDashboardLinkQuery, PayoutsEligibleQuery } from './Payouts.gql';
import { useToasts } from '@codeday/topo/utils';
import { payoutsEligibleRole } from '../../roles';

const Payouts = ({ user, token, onChange }) => {
  const { error } = useToasts();
  const [payoutsEligible, setPayoutsEligible] = useState(user.payoutsEligible);
  const [isLoading, setIsLoading] = useState(false);
  const [isPayoutsStarted, setIsPayoutsStarted] = useState(false);
  const [isConfirmed, setIsConfirmed] = useState(false);
  
  const openDashboard = async (token, newWindow) => {
    setIsLoading(true);
    const { result, error: e } = await tryAuthenticatedApiQuery(PayoutsDashboardLinkQuery, { id: user.id }, token);
    setIsLoading(false);
    if (e) error(e.message);
    else {
      if (newWindow) window.open(result.account.getUser.payoutsDashboardLink, '_blank')?.focus?.();
      else window.location = result.account.getUser.payoutsDashboardLink;
    }
  };

  const refresh = async (token) => {
    setIsLoading(true);
    const { result, error: e } = await tryAuthenticatedApiQuery(PayoutsEligibleQuery, { id: user.id }, token);
    setIsLoading(false);
    if (e) error(e.message);
    else {
      onChange({ payoutsEligible: result.account.getUser.payoutsEligible });
      setPayoutsEligible(result.account.getUser.payoutsEligible);
    }
  };

  if (!user.roles.find((role) => role.id === payoutsEligibleRole)) return <></>;

  return (
    <FormControl>
      <FormLabel fontWeight="bold">Payouts</FormLabel>
      <Text>
        <strong>Eligibility:</strong> {payoutsEligible ? 'Eligible' : 'Missing Information'}
      </Text>
      {!payoutsEligible && (
        <ConfirmAll
          mb={4}
          mt={2}
          onUpdate={setIsConfirmed}
          isDisabled={isPayoutsStarted}
          toConfirm={[
            'I understand that I will not be classified as an employee of CodeDay.',
            'I understand that I am responisible for withholding and paying taxes on the money I receive.',
            'I have a social security number and legal authorization to work as an independent contractor in the US.',
          ]}
        />
      )}
      <Button
        isDisabled={isLoading || (!payoutsEligible && !isConfirmed)}
        isLoading={isLoading}
        onClick={async () => {
          if (!payoutsEligible) setIsPayoutsStarted(true);
          openDashboard(token, payoutsEligible)
        }}
      >
        {payoutsEligible ? 'Open Payouts Dashboard (new window)' : 'Register for Payouts'}
      </Button>
      {!payoutsEligible && (
        <>
          <Button
            isLoading={isLoading}
            onClick={async () => {
              refresh(token)
            }}
            ml={2}
          >
            Refresh
          </Button>
        </>
      )}
      <FormHelperText>
        Some of our programs offer payments (like a stipend or contractor fee).
        These payments are issued by CodeDay Software Services LLC and processed
        by our partner Stripe Connect.
      </FormHelperText>
    </FormControl>
  );
};
Payouts.propTypes = {
  user: PropTypes.object.isRequired,
  token: PropTypes.string.isRequired,
};
Payouts.provides = 'payoutsEligible';
export default Payouts;
