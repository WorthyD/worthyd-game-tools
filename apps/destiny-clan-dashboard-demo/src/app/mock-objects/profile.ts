export const getMockProfile = () => {
  const mockName = 'Demo Profile';
  const membershipId = '1234567890';

  const getRandomDateLast5Years = (): string => {
    const now = Date.now();
    const fiveYearsMs = 5 * 365.25 * 24 * 60 * 60 * 1000;
    const randomPast = Math.floor(Math.random() * fiveYearsMs);
    const d = new Date(now - randomPast);
    return d.toISOString().replace(/\.\d{3}Z$/, 'Z');
  };


  return {
    profile: {
      data: {
        userInfo: {
          membershipType: 3,
          membershipId: membershipId,
          displayName: mockName,
          applicableMembershipTypes: [1, 2, 3],
          bungieGlobalDisplayNameCode: 1234,
          bungieGlobalDisplayName: mockName
        },
        dateLastPlayed: getRandomDateLast5Years(),
        characterIds: ['100', '200', '300'],
        currentGuardianRank: 5,
        lifetimeHighestGuardianRank: 7
      }
    },
    profileProgression: {
      data: {
        seasonalArtifact: {
          artifactHash: 2894222926,
          pointProgression: {
            progressionHash: 3499874580,
            dailyProgress: 0,
            dailyLimit: 0,
            weeklyProgress: 0,
            weeklyLimit: 0,
            currentProgress: 0,
            level: 1,
            levelCap: 12,
            stepIndex: 1,
            progressToNextLevel: 0,
            nextLevelAt: 25000
          },
          pointsAcquired: 1,
          powerBonusProgression: {
            progressionHash: 1530197053,
            dailyProgress: 0,
            dailyLimit: 0,
            weeklyProgress: 0,
            weeklyLimit: 0,
            currentProgress: 0,
            level: 1,
            levelCap: 71,
            stepIndex: 1,
            progressToNextLevel: 0,
            nextLevelAt: 55000
          },
          powerBonus: 1
        }
      }
    },
    characters: {
      data: {
        '100': {
          membershipId: membershipId,
          membershipType: 3,
          characterId: '100',
          dateLastPlayed: '2023-12-06T10:15:16Z',
          minutesPlayedThisSession: '5',
          minutesPlayedTotal: '91344',
          light: Math.floor(Math.random() * 500) ,
          stats: {
            '144602215': 73,
            '392767087': 103,
            '1735777505': 40,
            '1935470627': 10,
            '1943323491': 50,
            '2996146975': 68,
            '4244567218': 35
          },
          raceHash: 898834093,
          genderHash: 3111576190,
          classHash: 671679327,
          raceType: 2,
          classType: 1,
          genderType: 0,
          emblemPath: '/common/destiny2_content/icons/756242d0ef5b42d343abdabaae941ff7.jpg',
          emblemBackgroundPath: '/common/destiny2_content/icons/296b11af221b2d5dda5f379cc22d7241.jpg',
          emblemHash: 1985773548,
          emblemColor: {
            red: 1,
            green: 0,
            blue: 0,
            alpha: 255
          },
          levelProgression: {
            progressionHash: 1716568313,
            dailyProgress: 0,
            dailyLimit: 0,
            weeklyProgress: 0,
            weeklyLimit: 0,
            currentProgress: 0,
            level: 50,
            levelCap: 50,
            stepIndex: 50,
            progressToNextLevel: 0,
            nextLevelAt: 0
          },
          baseCharacterLevel: 50,
          percentToNextLevel: 0,
          titleRecordHash: 3766199186
        },
        '200': {
          membershipId: membershipId,
          membershipType: 3,
          characterId: '200',
          dateLastPlayed: '2023-06-14T01:10:15Z',
          minutesPlayedThisSession: '0',
          minutesPlayedTotal: '21168',
          light: Math.floor(Math.random() * 500),
          stats: {
            '144602215': 62,
            '392767087': 95,
            '1735777505': 50,
            '1935470627': 10,
            '1943323491': 27,
            '2996146975': 33,
            '4244567218': 42
          },
          raceHash: 3887404748,
          genderHash: 3111576190,
          classHash: 3655393761,
          raceType: 0,
          classType: 0,
          genderType: 0,
          emblemPath: '/common/destiny2_content/icons/8cabfb9c9dad40b062491b90c820f458.jpg',
          emblemBackgroundPath: '/common/destiny2_content/icons/cca0cacbbc6e77c5ea86c3c5b2ff6e53.jpg',
          emblemHash: 3639046094,
          emblemColor: {
            red: 0,
            green: 0,
            blue: 0,
            alpha: 255
          },
          levelProgression: {
            progressionHash: 1716568313,
            dailyProgress: 0,
            dailyLimit: 0,
            weeklyProgress: 0,
            weeklyLimit: 0,
            currentProgress: 0,
            level: 50,
            levelCap: 50,
            stepIndex: 50,
            progressToNextLevel: 0,
            nextLevelAt: 0
          },
          baseCharacterLevel: 50,
          percentToNextLevel: 0,
          titleRecordHash: 1185680627
        },
        '300': {
          membershipId: '4611686018467238913',
          membershipType: 3,
          characterId: '300',
          dateLastPlayed: '2023-10-27T02:35:12Z',
          minutesPlayedThisSession: '26',
          minutesPlayedTotal: '13528',
          light: Math.floor(Math.random() * 500),
          stats: {
            '144602215': 60,
            '392767087': 35,
            '1735777505': 25,
            '1935470627': 10,
            '1943323491': 76,
            '2996146975': 32,
            '4244567218': 39
          },
          raceHash: 2803282938,
          genderHash: 2204441813,
          classHash: 2271682572,
          raceType: 1,
          classType: 2,
          genderType: 1,
          emblemPath: '/common/destiny2_content/icons/893d952af25b57cf8fe61a3fd644f0e2.jpg',
          emblemBackgroundPath: '/common/destiny2_content/icons/8c95ff2cf97c08390dde61f544b69ab8.jpg',
          emblemHash: 3986958430,
          emblemColor: {
            red: 0,
            green: 2,
            blue: 3,
            alpha: 255
          },
          levelProgression: {
            progressionHash: 1716568313,
            dailyProgress: 0,
            dailyLimit: 0,
            weeklyProgress: 0,
            weeklyLimit: 0,
            currentProgress: 0,
            level: 50,
            levelCap: 50,
            stepIndex: 50,
            progressToNextLevel: 0,
            nextLevelAt: 0
          },
          baseCharacterLevel: 50,
          percentToNextLevel: 0,
          titleRecordHash: 3214425110
        }
      },
      privacy: 1
    },
    characterProgressions: {
      data: {
        '2305843009310516628': {
          progressions: {}
        },
        '2305843009319768855': {
          progressions: {}
        },
        '2305843009319768858': {
          progressions: {}
        }
      }
    },
    characterRecords: {
      privacy: 2,
      data: {
        '2305843009310516628': {
          records: {}
        }
      }
    },
    profileCollectibles: {
      data: {
        collectibles: {}
      }
    },
    profileRecords: {
      data: {
        score: 15185,
        activeScore: 15185,
        lifetimeScore: 128252,
        records: {}
      }
    },
    metrics: {
      data: {
        metrics: {}
      }
    }
  };
};
