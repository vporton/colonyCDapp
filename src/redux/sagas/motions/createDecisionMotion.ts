import { call, fork, put, takeEvery } from 'redux-saga/effects';
import { AnyColonyClient, ClientType, getChildIndex } from '@colony/colony-js';

import { ContextModule, getContext } from '~context/index';
import { Action, ActionTypes, AllActions } from '~redux/index';
import { putError, takeFrom, routeRedirect } from '~utils/saga/effects';
import { ACTION_DECISION_MOTION_CODE, ADDRESS_ZERO } from '~constants';
import {
  transactionAddParams,
  transactionPending,
  transactionReady,
} from '~redux/actionCreators';
import { TransactionChannel } from '~redux/types/actions/transaction';
import { removeDecisionFromLocalStorage } from '~utils/decisions';
import {
  createTransaction,
  createTransactionChannels,
  getTxChannel,
} from '../transactions';
import { getColonyManager } from '../utils';

function* createDecisionMotion({
  payload: {
    colonyName,
    colonyAddress,
    decision,
    decision: { motionDomainId, title },
  },
  meta: { id: metaId, navigate },
  meta,
}: Action<ActionTypes.MOTION_CREATE_DECISION>) {
  const txChannel: TransactionChannel = yield call(getTxChannel, metaId);

  try {
    // Validate the required values
    if (!colonyAddress) {
      throw new Error('Colony address is required when creating a Decision.');
    }

    if (!title) {
      throw new Error('Decision title is required when creating a Decision.');
    }

    if (!motionDomainId) {
      throw new Error('Motion Domain id is required when creating a Decision.');
    }

    const colonyManager = yield call(getColonyManager);
    const colonyClient: AnyColonyClient = yield call(
      [colonyManager, colonyManager.getClient],
      ClientType.ColonyClient,
      colonyAddress,
    );

    const childSkillIndex = yield call(
      getChildIndex,
      colonyClient,
      motionDomainId,
      motionDomainId,
    );

    const { skillId } = yield call(
      [colonyClient, colonyClient.getDomain],
      motionDomainId,
    );

    console.log(6, skillId, motionDomainId);

    const { key, value, branchMask, siblings } = yield call(
      colonyClient.getReputation,
      skillId,
      ADDRESS_ZERO,
    );

    console.log(7);

    // setup batch ids and channels
    const batchKey = 'createMotion';

    const { createMotion, annotateMotion } = yield call(
      createTransactionChannels,
      metaId,
      ['createMotion', 'annotateMotion'],
    );

    // create transactions
    yield fork(createTransaction, createMotion.id, {
      context: ClientType.VotingReputationClient,
      methodName: 'createMotion',
      identifier: colonyAddress,
      params: [
        motionDomainId,
        childSkillIndex,
        ADDRESS_ZERO,
        ACTION_DECISION_MOTION_CODE,
        key,
        value,
        branchMask,
        siblings,
      ],
      group: {
        key: batchKey,
        id: metaId,
        index: 0,
      },
      ready: false,
    });

    yield fork(createTransaction, annotateMotion.id, {
      context: ClientType.ColonyClient,
      methodName: 'annotateTransaction',
      identifier: colonyAddress,
      params: [],
      group: {
        key: batchKey,
        id: metaId,
        index: 1,
      },
      ready: false,
    });

    yield takeFrom(createMotion.channel, ActionTypes.TRANSACTION_CREATED);
    yield takeFrom(annotateMotion.channel, ActionTypes.TRANSACTION_CREATED);

    yield put(transactionReady(createMotion.id));

    const {
      payload: { hash: txHash },
    } = yield takeFrom(
      createMotion.channel,
      ActionTypes.TRANSACTION_HASH_RECEIVED,
    );

    yield put(transactionPending(annotateMotion.id));

    yield put(
      transactionAddParams(annotateMotion.id, [
        txHash,
        JSON.stringify(decision),
      ]),
    );

    yield put(transactionReady(annotateMotion.id));

    yield takeFrom(annotateMotion.channel, ActionTypes.TRANSACTION_SUCCEEDED);

    yield put<AllActions>({
      type: ActionTypes.MOTION_CREATE_DECISION_SUCCESS,
      meta,
    });

    if (colonyName) {
      yield routeRedirect(
        `/colony/${colonyName}/decisions/tx/${txHash}`,
        navigate,
      );
    }

    put({
      type: ActionTypes.DECISION_DRAFT_REMOVED,
      payload: decision.walletAddress,
    });
    removeDecisionFromLocalStorage(decision.walletAddress);
  } catch (caughtError) {
    putError(ActionTypes.MOTION_CREATE_DECISION_ERROR, caughtError, meta);
  } finally {
    txChannel.close();
  }
}

export default function* createDecisionMotionSaga() {
  yield takeEvery(ActionTypes.MOTION_CREATE_DECISION, createDecisionMotion);
}
