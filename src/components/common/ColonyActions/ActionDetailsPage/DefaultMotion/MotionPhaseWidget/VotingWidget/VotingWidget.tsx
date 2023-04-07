import React from 'react';
import { defineMessages, FormattedMessage } from 'react-intl';
import { object, number, InferType } from 'yup';
import { BigNumber } from 'ethers';

import { ActionHookForm as ActionForm, OnSuccess } from '~shared/Fields';
import { ActionTypes } from '~redux';

import { ColonyActionType } from '~gql';
import { MotionData } from '~types';
import { MotionState } from '~utils/colonyMotions';
import { useAppContext, useColonyContext } from '~hooks';
import { mapPayload } from '~utils/actions';
import { MotionVotePayload } from '~redux/sagas/motions/voteMotion';

import { PollingControls } from '../MotionPhaseWidget';

import {
  VoteDetails,
  VotingPanel,
  useVotingWidgetUpdate,
  VotingWidgetHeading,
} from '.';

import styles from './VotingWidget.css';

const displayName =
  'common.ColonyActions.ActionDetailsPage.DefaultMotion.VotingWidget';

const MSG = defineMessages({
  voteHidden: {
    id: `${displayName}.voteHidden`,
    defaultMessage: `Your vote is hidden from others.\nYou can change your vote.`,
  },
});

const validationSchema = object()
  .shape({
    vote: number().required(),
  })
  .defined();

type VotingFormValues = InferType<typeof validationSchema>;

interface VotingWidgetProps extends PollingControls {
  actionType: ColonyActionType;
  motionData: MotionData;
  motionState: MotionState;
}

export const VOTE_FORM_KEY = 'vote';

const VotingWidget = ({
  actionType,
  motionData: { motionDomainId, motionId, voterRecord },
  motionState,
  startPollingAction,
  stopPollingAction,
}: VotingWidgetProps) => {
  const { colony } = useColonyContext();
  const { user } = useAppContext();
  const { hasUserVoted, setHasUserVoted } = useVotingWidgetUpdate(
    voterRecord,
    stopPollingAction,
  );

  const transform = mapPayload(
    ({ vote }) =>
      ({
        colonyAddress: colony?.colonyAddress ?? '',
        userAddress: user?.walletAddress,
        vote: Number(vote),
        motionId: BigNumber.from(motionId),
      } as MotionVotePayload),
  );

  const handleSuccess: OnSuccess<VotingFormValues> = (_, { reset }) => {
    setHasUserVoted(true);
    reset();
    startPollingAction(1000);
  };

  return (
    <div>
      {hasUserVoted && (
        <p className={styles.voteHiddenContainer}>
          <FormattedMessage {...MSG.voteHidden} />
        </p>
      )}
      <ActionForm<VotingFormValues>
        defaultValues={{
          [VOTE_FORM_KEY]: undefined,
        }}
        validationSchema={validationSchema}
        actionType={ActionTypes.MOTION_VOTE}
        transform={transform}
        onSuccess={handleSuccess}
      >
        <div className={styles.main}>
          <VotingWidgetHeading actionType={actionType} />
          <VotingPanel motionDomainId={Number(motionDomainId)} />
          <VoteDetails
            motionId={motionId}
            motionDomainId={motionDomainId}
            motionState={motionState}
            hasUserVoted={hasUserVoted}
          />
        </div>
      </ActionForm>
    </div>
  );
};

VotingWidget.displayName = displayName;

export default VotingWidget;
