import React from 'react';
import { useParams } from 'react-router-dom';

import ProfileTemplate from '~frame/ProfileTemplate';
import NotFoundRoute from '~routes/NotFoundRoute';
import { useUserByNameOrAddress } from '~hooks';

import UserMeta from './UserMeta';
import UserProfileSpinner from './UserProfileSpinner';
import UserColonies from './UserColonies';

import styles from './UserProfile.css';

const UserProfile = () => {
  const { username } = useParams();
  const { user, loading, error } = useUserByNameOrAddress(username || '');

  if (loading) {
    return <UserProfileSpinner />;
  }

  if (error || !user) {
    return <NotFoundRoute />;
  }

  return (
    <ProfileTemplate asideContent={<UserMeta user={user} />}>
      <section className={styles.sectionContainer}>
        <UserColonies user={user} />
      </section>
    </ProfileTemplate>
  );
};

export default UserProfile;
