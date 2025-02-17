import React from 'react';

import {
  getActionTitleMessageId,
  getActionTitleValues,
} from '~common/ColonyActions/helpers';
import { Heading3 } from '~shared/Heading';
import { Colony, ColonyAction } from '~types';

import ActionsPageFeed from '../ActionDetailsPageFeed';

import styles from './DefaultAction.css';

const displayName = 'common.ColonyActions.ActionsPage.DefaultActionContent';

interface DefaultActionContentProps {
  colony: Colony;
  actionData: ColonyAction;
}

const DefaultActionContent = ({
  colony,
  actionData,
}: DefaultActionContentProps) => (
  <div className={styles.content}>
    <Heading3
      className={styles.heading}
      data-test="actionHeading"
      text={{ id: getActionTitleMessageId(actionData, colony) }}
      textValues={getActionTitleValues(actionData, colony)}
    />
    <ActionsPageFeed actionData={actionData} />
  </div>
);

DefaultActionContent.displayName = displayName;

export default DefaultActionContent;
