
import React from 'react';
import FriendsViewContainer from './friends/FriendsViewContainer';

const FriendsView = React.memo(() => {
  return <FriendsViewContainer />;
});

FriendsView.displayName = 'FriendsView';

export default FriendsView;
