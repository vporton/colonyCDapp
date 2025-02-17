import React, { ReactNode } from 'react';
import { MessageDescriptor } from 'react-intl';

import { Heading3 } from '~shared/Heading';
import { UniversalMessageValues } from '~types';

// import { ForceToggle } from '~shared/Fields';
// import MotionDomainSelect from '~dashboard/MotionDomainSelect';

import styles from './DialogHeading.css';

const displayName = 'DialogHeading';

interface Props {
  title: MessageDescriptor;
  titleValues?: UniversalMessageValues;
  children?: ReactNode;
}

const DialogHeading = ({ title, titleValues, children }: Props) => {
  // const handleFilterMotionDomains = (optionDomain) => {
  //     const optionDomainId = parseInt(optionDomain.value, 10);
  //     if (currentFromDomain === Id.RootDomain) {
  //       return optionDomainId === Id.RootDomain;
  //     }
  //     return (
  //       optionDomainId === currentFromDomain ||
  //       optionDomainId === Id.RootDomain
  //     );
  //   };

  // const handleMotionDomainChange = (motionDomainId) => setFieldValue('motionDomainId', motionDomainId);

  return (
    <div className={styles.modalHeading}>
      {/*
       * @NOTE We can only create a motion to vote in a subdomain if we
       * create a payment from that subdomain
       */}
      {/* {isVotingExtensionEnabled && (
        <div className={styles.motionVoteDomain}>
          <MotionDomainSelect
            colony={colony}
            onDomainChange={handleMotionDomainChange}
            disabled={values.forceAction || isSubmitting}
            filterDomains={handleFilterMotionDomains}
            initialSelectedDomain={domainId}
          />
        </div>
      )} */}
      <div className={styles.headingContainer}>
        <Heading3
          appearance={{ size: 'medium', margin: 'none', theme: 'dark' }}
          text={title}
          textValues={titleValues}
        />
        {/* {hasRoles && isVotingExtensionEnabled && (
          <ForceToggle disabled={!canMakePayment || isSubmitting} />
        )} */}
      </div>
      {children}
    </div>
  );
};

DialogHeading.displayName = displayName;

export default DialogHeading;
