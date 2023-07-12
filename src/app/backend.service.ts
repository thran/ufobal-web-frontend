import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';
import { shareReplay } from 'rxjs';
import { Entity, ET, Tournament } from './models';

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

  public getEntities(entityType: ET, params: any = null) {
    let endpoint;
    if (entityType === ET.Player) endpoint = '/players';
    if (entityType === ET.TeamOnTournament) endpoint = '/teamontournaments';
    if (entityType === ET.Match) endpoint = '/matchs';
    if (entityType === ET.GoalPair) {
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

  public getGoalStats() {
    return this._get<any>('/goals')
  }
}
