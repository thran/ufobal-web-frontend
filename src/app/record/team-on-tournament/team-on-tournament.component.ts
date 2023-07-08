import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-team-on-tournament',
  templateUrl: './team-on-tournament.component.html',
  styleUrls: ['./team-on-tournament.component.css']
})
export class TeamOnTournamentComponent {
  @Input() tournamentId?: number;
  @Input() teamId?: number;

}
