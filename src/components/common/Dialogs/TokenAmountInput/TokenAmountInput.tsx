import React, { useMemo } from 'react';
import { defineMessages } from 'react-intl';
import { AddressZero } from '@ethersproject/constants';
import { useFormContext } from 'react-hook-form';

import { HookFormInput as Input, TokenSymbolSelector } from '~shared/Fields';
import EthUsd from '~shared/EthUsd';
import { getSelectedToken, getTokenDecimalsWithFallback } from '~utils/tokens';
import { notNull } from '~utils/arrays';
import { Colony } from '~types';

// import NetworkFee from '../NetworkFee';

import styles from './TokenAmountInput.css';

const displayName = 'TokenAmountInput';

const MSG = defineMessages({
  amount: {
    id: `${displayName}.amount`,
    defaultMessage: 'Amount',
  },
  fee: {
    id: `${displayName}.fee`,
    defaultMessage: 'Network fee: {fee} {symbol}',
  },
  token: {
    id: `${displayName}.address`,
    defaultMessage: 'Token',
  },
});

interface Props {
  colony: Colony;
  disabled: boolean;
}

const TokenAmountInput = ({ colony, disabled }: Props) => {
  const { watch } = useFormContext();
  const { amount, tokenAddress } = watch();
  const colonyTokens = colony?.tokens?.items.filter(notNull).map((colonyToken) => colonyToken.token) || [];
  const selectedToken = getSelectedToken(colony, tokenAddress);
  const formattingOptions = useMemo(
    () => ({
      delimiter: ',',
      numeral: true,
      numeralPositiveOnly: true,
      numeralDecimalScale: getTokenDecimalsWithFallback(selectedToken && selectedToken.decimals),
    }),
    [selectedToken],
  );

  return (
    <div className={styles.tokenAmount}>
      <div className={styles.tokenAmountInputContainer}>
        <Input
          label={MSG.amount}
          name="amount"
          appearance={{
            theme: 'minimal',
            align: 'right',
          }}
          formattingOptions={formattingOptions}
          disabled={disabled}
          dataTest="paymentAmountInput"
          // @NOTE: If we don't explicitly pass the amount value here, the input will lose their value when a different token is selected.
          // (Most likely to do with formattingOptions changing when the token changes?)
          value={amount}
        />
        {/* <NetworkFee colony={colony} networkFeeInverse={networkFeeInverse} customAmountError={customAmountError} /> */}
      </div>
      <div className={styles.tokenAmountContainer}>
        <div className={styles.tokenAmountSelect}>
          <TokenSymbolSelector
            label={MSG.token}
            tokens={colonyTokens}
            name="tokenAddress"
            elementOnly
            appearance={{ alignOptions: 'right', theme: 'grey' }}
            disabled={disabled}
          />
        </div>
        {tokenAddress === AddressZero && (
          <div className={styles.tokenAmountUsd}>
            <EthUsd
              // appearance={{ theme: 'grey' }}
              value={amount.replace(/,/g, '') || 0} // @TODO: Remove this once the fix for FormattedInputComponent value is introduced.
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default TokenAmountInput;
