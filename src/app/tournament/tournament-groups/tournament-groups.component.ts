import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-tournament-groups',
  templateUrl: './tournament-groups.component.html',
  styleUrls: ['./tournament-groups.component.css']
})
export class TournamentGroupsComponent {
  @Input() tournamentId?: number;
}
