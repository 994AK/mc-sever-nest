// players.ts
export interface Player {
  name: string;
}

export interface PlayersItem {
  max: number;
  now: number;
  sample: Player[];
}

export interface PlayersData {
  code: number;
  data: { players: PlayersItem };
  message: string;
}
