import React from 'react';
import { FormattedMessage, defineMessages } from 'react-intl';

import { MotionState } from '~utils/colonyMotions';
import { MiniSpinnerLoader } from '~shared/Preloaders';
import TimerValue from '~shared/TimerValue';

import { useMotionCountdown } from './helpers';

import styles from './CountDownTimer.css';

const displayName = 'common.ColonyActions.CountDownTimer';

const MSG = defineMessages({
  title: {
    id: `${displayName}.title`,
    defaultMessage: `{motionState, select,
        Staking {Time left to stake}
        Staked {Motion will pass in}
        Objection {Motion will fail in}
        Voting {Voting ends in}
        Reveal {Reveal ends in}
        Escalation {Time left to escalate}
        other {Timeout}
      }`,
  },
  loadingText: {
    id: `${displayName}.loadingText`,
    defaultMessage: 'Loading countdown period',
  },
});

interface Props {
  state: MotionState;
  motionId: number;
  isFullyNayStaked?: boolean;
}

const CountDownTimer = ({
  state,
  motionId,
  isFullyNayStaked = false,
}: Props) => {
  const { countdown, loadingCountdown } = useMotionCountdown(
    state,
    motionId,
    isFullyNayStaked,
  );

  if (loadingCountdown) {
    return (
      <MiniSpinnerLoader
        loadingText={MSG.loadingText}
        className={styles.loader}
      />
    );
  }

  return (
    <div className={styles.container} data-test="countDownTimer">
      <FormattedMessage {...MSG.title} values={{ motionState: state }} />
      <span className={styles.time}>
        <TimerValue splitTime={countdown} />
      </span>
    </div>
  );
};

CountDownTimer.displayName = displayName;

export default CountDownTimer;
