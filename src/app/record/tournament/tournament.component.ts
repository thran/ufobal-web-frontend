import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-tournament',
  templateUrl: './tournament.component.html',
  styleUrls: ['./tournament.component.css']
})
export class TournamentComponent {
  @Input() tournamentId?: number;

}
