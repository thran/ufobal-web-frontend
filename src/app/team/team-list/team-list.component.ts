import { Component, OnInit } from '@angular/core';
import { Team } from '../../models';
import { EntitiesService } from '../../entities.service';

@Component({
  selector: 'app-team-list',
  templateUrl: './team-list.component.html',
  styleUrls: ['./team-list.component.css']
})
export class TeamListComponent implements OnInit{
  public teams: Team[] | null = null;

  constructor(
    public entities: EntitiesService,
  ) {
  }

  ngOnInit(): void {
    this.entities.getTeams().subscribe((teams) => this.teams = teams);
  }
}
