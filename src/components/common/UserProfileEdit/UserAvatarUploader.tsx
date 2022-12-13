import React, { useEffect, useState } from 'react';
import { defineMessages } from 'react-intl';

import { FileReaderFile } from '~shared/FileUpload';
import AvatarUploader from '~shared/AvatarUploader';
import UserAvatar from '~shared/UserAvatar';
import { InputStatus } from '~shared/Fields';

import { User } from '~types';
import { useUpdateUserProfileMutation } from '~gql';
import { useAppContext } from '~hooks';
import { excludeTypenameKey } from '~utils/objects';

import styles from './UserAvatarUploader.css';

const displayName = 'common.UserProfileEdit.UserAvatarUploader';

const MSG = defineMessages({
  uploaderLabel: {
    id: `${displayName}.uploaderLabel`,
    defaultMessage: 'At least 250x250px, up to 1MB, .png or .svg',
  },
  avatarFileError: {
    id: `${displayName}.avatarFileError`,
    defaultMessage: 'This filetype is not allowed or file is too big',
  },
});

interface Props {
  /** Current user */
  user: User;
}

const UserAvatarUploader = ({
  user,
  user: { walletAddress, profile },
}: Props) => {
  const userProfile = excludeTypenameKey(profile);
  const appContext = useAppContext();

  const [updateAvatar, { error, called, loading }] =
    useUpdateUserProfileMutation();

  const [avatarFileError, setAvatarFileError] = useState(false);

  const handleUpload = (fileData: FileReaderFile) => {
    setAvatarFileError(false);
    return updateAvatar({
      variables: {
        input: {
          id: walletAddress,
          ...userProfile,
          avatar: fileData.data,
        },
      },
    });
  };

  const remove = () =>
    updateAvatar({
      variables: {
        input: { id: walletAddress, ...userProfile, avatar: null },
      },
    });

  const handleError = async () => {
    setAvatarFileError(true);
  };

  useEffect(() => {
    setAvatarFileError(!!error);
  }, [error]);

  useEffect(() => {
    if (called && !loading && appContext.updateUser) {
      appContext.updateUser(user.walletAddress);
    }
  }, [appContext, called, loading, user]);

  return (
    <>
      <AvatarUploader
        label={MSG.uploaderLabel}
        hasButtons
        placeholder={
          <UserAvatar
            address={user.walletAddress}
            user={user}
            size="xl"
            notSet={false}
            preferThumbnail={false}
          />
        }
        upload={handleUpload}
        remove={remove}
        isSet={!!user && !!user.profile && !!user.profile.avatar}
        handleError={handleError}
      />
      {avatarFileError && (
        <div className={styles.inputStatus}>
          <InputStatus error={MSG.avatarFileError} />
        </div>
      )}
    </>
  );
};

UserAvatarUploader.displayName = displayName;

export default UserAvatarUploader;
