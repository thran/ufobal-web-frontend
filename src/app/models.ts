export class User {
  first_name!: string;
  last_name!: string;
  is_staff!: boolean;
  is_authorized!: boolean;
  player!: Player | null;
}

export class Player {
  pk!: number;
  name!: string;
  lastname!: string;
  nickname!: string;
  age!: number;
  full_name!: string;
  gender!: string;
  is_paired!: boolean;
  penalties!: Penalty[];
  birthdate?: string;
  tournaments?: Tournament[];
}

export class Penalty {
}

export class Tournament {
}
