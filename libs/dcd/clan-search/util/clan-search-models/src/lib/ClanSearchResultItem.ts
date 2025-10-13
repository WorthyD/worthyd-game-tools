export type ClanSearchResultItemType = 'player' | 'clan';

export interface ClanSearchResultItem {
  iconName: string;
  name: string;
  clanInfo: any;
  type: ClanSearchResultItemType;
  memberInfo?: any;
  id?: string;
}

