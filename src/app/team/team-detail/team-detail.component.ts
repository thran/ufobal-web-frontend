import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-team-detail',
  templateUrl: './team-detail.component.html',
  styleUrls: ['./team-detail.component.css']
})
export class TeamDetailComponent {
  @Input() teamId?: number;
}
