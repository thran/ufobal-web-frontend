import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-tournament-detail',
  templateUrl: './tournament-detail.component.html',
  styleUrls: ['./tournament-detail.component.css']
})
export class TournamentDetailComponent {
  @Input() tournamentId?: number;
  @Input() teamId?: number;

}
