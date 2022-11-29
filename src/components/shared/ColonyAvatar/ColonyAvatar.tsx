import React from 'react';

import Avatar, { Props as AvatarProps } from '~shared/Avatar';
import NavLink from '~shared/NavLink';

import { WatchedColonyFragment } from '~gql';
import { Address, Colony } from '~types';

export interface Props
  extends Pick<AvatarProps, 'className' | 'notSet' | 'size'> {
  /** Address of the colony for identicon fallback */
  colonyAddress: Address;

  /** If true the UserAvatar links to the user's profile */
  showLink?: boolean;

  /** The corresponding user object if available */
  colony?: WatchedColonyFragment | Colony;

  avatarURL?: string;

  preferThumbnail?: boolean;
}

const displayName = 'ColonyAvatar';

const ColonyAvatar = ({
  colonyAddress,
  avatarURL,
  className,
  colony,
  notSet,
  size,
  showLink,
  preferThumbnail = true,
}: Props) => {
  const { profile, name } = colony || {};
  const imageString = preferThumbnail ? profile?.thumbnail : profile?.avatar;
  const colonyAvatar = (
    <Avatar
      avatarString={avatarURL || imageString || undefined}
      className={className}
      notSet={notSet}
      placeholderIcon="at-sign-circle"
      seed={colonyAddress && colonyAddress.toLowerCase()}
      size={size}
      title={profile?.displayName || name || colonyAddress}
    />
  );
  if (showLink && name) {
    return <NavLink to={`/colony/${name}`}>{colonyAvatar}</NavLink>;
  }
  return colonyAvatar;
};

ColonyAvatar.displayName = displayName;

export default ColonyAvatar;
