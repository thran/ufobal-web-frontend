import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';
import { shareReplay } from 'rxjs';
import { Entity, EntityType, Tournament } from './models';

@Injectable({
  providedIn: 'root'
})
export class BackendService {

  private readonly BASE_URL = '/api_frontend';

  constructor(
    private http: HttpClient,
    private toaster: ToastrService,
  ) {
  }

  private _get<T>(endpoint: string, params: any = null) {
    return this.http.get<T>(this.BASE_URL + endpoint, {params: params}).pipe(shareReplay());
  }

  public getEntities(entityType: EntityType, params: any = null) {
    let endpoint;
    if (entityType === EntityType.Player) endpoint = '/players';
    if (entityType === EntityType.TeamOnTournament) endpoint = '/teamontournaments';
    if (entityType === EntityType.Match) endpoint = '/matchs';
    if (entityType === EntityType.GoalPair) {
      endpoint = `/pairs/${params.tournament_id}`;
      params = null;
    }
    if (!endpoint) {
      throw new Error('Unknown entity type ' + entityType);
    }
    return this._get<Entity []>(endpoint, params);
  }

  public getEmptyTournaments() {
    return this._get<Tournament []>('/get_empty_trournaments');
  }

  public getTournament(pk: number) {
    return this._get<Tournament>('/tournament/' + pk);
  }
}
