import { Injectable } from '@angular/core';
import { BackendService } from './backend.service';
import {
  Entity,
  EntityType,
  GoalPair,
  Match,
  Penalty,
  Player,
  PlayerStats,
  Team,
  TeamOnTournament,
  Tournament
} from './models';
import { combineLatestWith, map, Observable, of, shareReplay, tap } from 'rxjs';

export function unidecode(str: string): string {
  return str.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
}

@Injectable({
  providedIn: 'root'
})
export class EntitiesService {

  private entities: { [entityType in EntityType]?: Entity [] } = {};
  private entityMaps: { [entityType in EntityType]: { [pk: number]: Entity } } = {
    [EntityType.Player]: <{ [pk: number]: Player }>{},
    [EntityType.Team]: <{ [pk: number]: Team }>{},
    [EntityType.Tournament]: <{ [pk: number]: Tournament }>{},
    [EntityType.TeamOnTournament]: <{ [pk: number]: TeamOnTournament }>{},
    [EntityType.Match]: <{ [pk: number]: Match }>{},
    [EntityType.Penalty]: <{ [pk: number]: Penalty }>{},
    [EntityType.GoalPair]: <{ [pk: number]: GoalPair }>{},
  };
  private entityObservables: { [key: string]: Observable<Entity []> } = {};

  constructor(
    private backend: BackendService,
  ) {
  }

  /**
   * take player object retrieved from backend and prepare it for frontend
   */
  private _processPlayer(player: Player): Player {

    player.birthdate = player.birthdate ? new Date(player.birthdate) : null;
    player.tournaments = [];
    player.stats = new PlayerStats();
    player.stats.penalties = player.penalties ? player.penalties.length : 0;
    player.searchable = player.nickname + "###" + unidecode(player.nickname);

    let penalties: Penalty[] = [];
    player.penalties.forEach(penalty => {
      penalties.push(this._processEntity(EntityType.Penalty, penalty) as Penalty);
    });
    player.penalties = penalties;

    return player;
  }

  /**
   * take team object retrieved from backend and prepare it for frontend
   */
  private _processTeam(team: Team): Team {
    team.matches = [];
    team.team_on_tournaments = [];
    team.medals = [0, 0, 0, 0, 0]

    if (!this.entities[EntityType.Team]) {
      this.entities[EntityType.Team] = [];
    }
    this.entities[EntityType.Team].push(team);
    return team;
  }

  /**
   * take tournament object retrieved from backend and prepare it for frontend
   */
  private _processTournament(tournament: Tournament): Tournament {
    tournament.matches = [];
    tournament.team_on_tournaments = [];
    tournament.fields = [];
    for (let i = 1; i <= tournament.field_count; i++) {
      tournament.fields.push("" + i);
    }

    if (!this.entities[EntityType.Tournament]) {
      this.entities[EntityType.Tournament] = [];
    }
    this.entities[EntityType.Tournament].push(tournament);
    return tournament;
  }

  /**
   * take team on tournament object retrieved from backend and prepare it for frontend
   */
  private _processTeamOnTournament(teamOnTournament: TeamOnTournament): TeamOnTournament {
    teamOnTournament.matches = [];

    // create and link teams
    let team: Team = this._processEntity(EntityType.Team, teamOnTournament.team) as Team;
    team.team_on_tournaments!.push(teamOnTournament);
    if (teamOnTournament.rank < 6) {
      team.medals![teamOnTournament.rank - 1] += 1;
    }

    // create and link tournaments
    let tournament: Tournament = this._processEntity(EntityType.Tournament, teamOnTournament.tournament) as Tournament;
    tournament.team_on_tournaments!.push(teamOnTournament);

    // link players
    teamOnTournament.players = [];
    teamOnTournament.player_pks!.forEach(playerPk => {
      let player = this.entityMaps[EntityType.Player][playerPk] as Player;
      player.tournaments!.push(teamOnTournament);
      teamOnTournament.players!.push(player);
      if (playerPk === teamOnTournament.captain) {
        teamOnTournament.captain = player;
      }
      if (playerPk === teamOnTournament.default_goalie) {
        teamOnTournament.default_goalie = player;
      }
      player.penalties.forEach(penalty => {
        if (teamOnTournament.tournament.pk === penalty.tournament) {
          penalty.tournament = teamOnTournament.tournament;
        }
      });
    });

    return teamOnTournament;
  }

  /**
   * take match object retrieved from backend and prepare it for frontend
   */
  private _processMatch(match: Match): Match {
    if (typeof match.tournament === "number") {
      match.tournament = this.entityMaps[EntityType.Tournament][match.tournament] as Tournament;
      match.tournament.matches!.push(match);
    }
    if (typeof match.team_one === "number") {
      match.team_one = this.entityMaps[EntityType.TeamOnTournament][match.team_one] as TeamOnTournament;
    }
    if (typeof match.team_two === "number") {
      match.team_two = this.entityMaps[EntityType.TeamOnTournament][match.team_two] as TeamOnTournament;
    }
    if (typeof match.referee_team === "number") {
      match.referee_team = this.entityMaps[EntityType.TeamOnTournament][match.referee_team] as TeamOnTournament;
    }
    if (typeof match.referee === "number") {
      match.referee = this.entityMaps[EntityType.Player][match.referee] as Player;
    }
    match.state = match.end ? "ended" : (match.start ? "ongoing" : "waiting");
    match.start = match.start !== null ? new Date(match.start) : null;
    match.end = match.end !== null ? new Date(match.end) : null;
    match.searchable = match.team_one.name + "###" + match.team_two.name;

    return match;
  }

  /**
   * take goal object retrieved from backend and prepare it for frontend
   */
  private _processPenalty(penalty: Penalty): Penalty {
    return penalty
  }

  /**
   * take goal object retrieved from backend and prepare it for frontend
   */
  private _processGoalPair(pair: GoalPair): GoalPair {
    pair.player_one = this.entityMaps[EntityType.Player][pair.players[0]] as Player;
    pair.player_two = this.entityMaps[EntityType.Player][pair.players[1]] as Player;
    pair.pk = pair.player_one.pk;
    return pair
  }

  /**
   * general entity processing
   *   - store in entityMaps
   *   - call specific processing function
   */
  private _processEntity(entityType: EntityType, entity: Entity): Entity {
    if (this.entityMaps[entityType][entity.pk]) {
      return this.entityMaps[entityType][entity.pk];
    }
    this.entityMaps[entityType][entity.pk] = entity;

    switch (entityType) {
      case EntityType.Player:
        return this._processPlayer(entity as Player);
      case EntityType.Team:
        return this._processTeam(entity as Team);
      case EntityType.Tournament:
        return this._processTournament(entity as Tournament);
      case EntityType.TeamOnTournament:
        return this._processTeamOnTournament(entity as TeamOnTournament);
      case EntityType.Match:
        return this._processMatch(entity as Match);
      case EntityType.Penalty:
        return this._processPenalty(entity as Penalty);
      case EntityType.GoalPair:
        return this._processGoalPair(entity as GoalPair);
      default:
        throw new Error("Unknown entity type: " + entityType);
    }
  }

  /**
   * general entities processing, ensure that entities are processed in correct order
   */
  private _processEntities(entityType: EntityType, entities: Entity []): Observable<Entity []> {
    return new Observable<Entity []>((subscriber) => {
      let process = () => {
        entities.forEach((entity) => {
          this._processEntity(entityType, entity);
        })
        subscriber.next(entities);
      }

      if (entityType === EntityType.GoalPair || entityType === EntityType.TeamOnTournament) {
        this._getEntities(EntityType.Player).subscribe((_) => {
          process()
        });
      } else if (entityType === EntityType.Match) {
        this._getEntities(EntityType.TeamOnTournament).subscribe((_) => {
          process()
        });
      } else {
        process()
      }
    });
  }

  /**
   * get entities from backend
   *   - allows to set custom params for backend filtering
   *   - if some entities are dependant on other entities, they are preloaded here
   *   - process entities and return them
   */
  private _getEntities(entityType: EntityType, params: any = null): Observable<Entity []> {
    let key = entityType + JSON.stringify(params)
    if (this.entityObservables[key]) {
      return this.entityObservables[key]!;
    }

    this.entityObservables[key] = new Observable<Entity []>((subscriber) => {
      let entitiesObservable = this.backend.getEntities(entityType, params);

      // other entities preloading
      if (entityType === EntityType.TeamOnTournament) {
        entitiesObservable = entitiesObservable.pipe(
          combineLatestWith(this._getEntities(EntityType.Player), this._getEmptyTournaments()),
          map(([entities, player, tournaments], index) => entities),
        )
      }
      entitiesObservable.subscribe((entities) => {
        this.entities[entityType] = entities;
        this._processEntities(entityType, entities).subscribe((entities) => {
          subscriber.next(entities);
        })
      })
    }).pipe(shareReplay())

    return this.entityObservables[key];
  }

  /**
   * get all teamOnTournaments,  tournaments and teams
   * @param withMatches - if true, also get all matches, if number, get only matches for tournament with that id
   */
  public _getTeamsOnTournaments(withMatches: boolean | number = false): Observable<TeamOnTournament []> {
    let observable = this._getEntities(EntityType.TeamOnTournament) as Observable<TeamOnTournament[]>;
    if (withMatches) {
      if (typeof withMatches === "number") {
        observable = observable.pipe(
          combineLatestWith(this._getEntities(EntityType.Match, {tournament_id: withMatches})),
          map(([teamsOnTournaments, matches]) => teamsOnTournaments)
        );
      } else {
        observable = observable.pipe(
          combineLatestWith(this._getEntities(EntityType.Match)),
          map(([teamsOnTournaments, matches]) => teamsOnTournaments)
        );
      }
    }
    return observable;
  }

  /**
   * get all tournaments without teams - these are omitted in _getTeamsOnTournaments
   */
  public _getEmptyTournaments(): Observable<Tournament []> {
    return this.backend.getEmptyTournaments().pipe(tap(
      (tournaments) => {
        this._processEntities(EntityType.Tournament, tournaments)
      }
    ));
  }

  /**
   * get or retrieve all teamsOnTournaments, tournaments, teams and players and return only players
   */
  public getPlayers(): Observable<Player []> {
    return this._getTeamsOnTournaments().pipe(map((teamsOnTournaments) => {
      if (!this.entities[EntityType.Player]) throw Error('Players are not loaded yet');
        return this.entities[EntityType.Player] as Player [];
    }));
  }

  /**
   * get or retrieve all teamsOnTournaments, tournaments, teams and players and return only teams
   * @param withMatches - if true, also get all matches
   */
  public getTeams(withMatches: boolean = false): Observable<Team []> {
    return this._getTeamsOnTournaments().pipe(map((teamsOnTournaments) => {
      if (!this.entities[EntityType.Team]) throw Error('Teams are not loaded yet');
        return this.entities[EntityType.Team] as Team [];
    }));
  }

  /**
   * get or retrieve all teamsOnTournaments, tournaments, teams and players and return only tournaments
   * @param withMatches - if true, also get all matches
   */
  public getTournaments(withMatches: boolean = false): Observable<Tournament []> {
    return this._getTeamsOnTournaments().pipe(map((teamsOnTournaments) => {
      if (!this.entities[EntityType.Tournament]) throw Error('Tournament are not loaded yet');
        return this.entities[EntityType.Tournament] as Tournament [];
    }));
  }

  /**
   * get specific tournament with matches and pairs
   * @param pk - tournament id
   */
  public getTournament(pk: number): Observable<Tournament> {
    if (pk in this.entityMaps[EntityType.Tournament]) {
      let tournament = this.entityMaps[EntityType.Tournament][pk] as Tournament;
      if (tournament.goalPairs) return of(this.entityMaps[EntityType.Tournament][pk] as Tournament);
    }

    let params = {tournament_id: pk};
    return this._getTeamsOnTournaments(pk).pipe(
      combineLatestWith(this._getEntities(EntityType.GoalPair, params)),
      map(([teamsOnTournaments, pairs]) => {
        let entityMapElement = this.entityMaps[EntityType.Tournament][pk] as Tournament;
        entityMapElement.goalPairs = pairs as GoalPair [];
        return entityMapElement;
      }),
    )
  }
}
