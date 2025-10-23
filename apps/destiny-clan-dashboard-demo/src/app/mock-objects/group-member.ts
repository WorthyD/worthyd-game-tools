const iconPaths = [
  '/img/theme/bungienet/icons/xboxLiveLogo.png',
  '/img/theme/bungienet/icons/psnLogo.png',
  '/img/theme/bungienet/icons/steamLogo.png',
  '/img/theme/bungienet/icons/epicGamesLogo.png',
  '/img/theme/bungienet/icons/blizzardLogo.png',
  '/img/theme/bungienet/icons/steamLogo.png'
];

export const getMockGroupMember = () => {
  const mockName = 'Demo Member';
  const memberType = Math.floor(Math.random() * 5);
  const iconPath = iconPaths[memberType];
  const isOnline = Math.random() < 0.5;

  return {
    memberType: memberType,
    isOnline: isOnline,
    lastOnlineStatusChange: '0000000000',
    groupId: '123456',
    destinyUserInfo: {
      LastSeenDisplayName: mockName,
      LastSeenDisplayNameType: 1,
      iconPath: iconPath,
      crossSaveOverride: 1,
      applicableMembershipTypes: [1,2,3],
      isPublic: false,
      membershipType: 1,
      membershipId: '4611686018467238913',
      displayName: mockName,
      bungieGlobalDisplayName: mockName,
      bungieGlobalDisplayNameCode: 1234
    },
    bungieNetUserInfo: {
      supplementalDisplayName: `${mockName}#1234`,
      iconPath: '/img/profile/avatars/Destiny09.jpg',
      crossSaveOverride: 0,
      isPublic: false,
      membershipType: 254,
      membershipId: '1234',
      displayName: mockName,
      bungieGlobalDisplayName: mockName,
      bungieGlobalDisplayNameCode: 1234
    },
    joinDate: '2020-09-07T04:26:56Z'
  };
};
