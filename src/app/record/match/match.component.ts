import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-match',
  templateUrl: './match.component.html',
  styleUrls: ['./match.component.css']
})
export class MatchComponent {
  @Input() tournamentId ?: number;
  @Input() matchId?: number;

}
