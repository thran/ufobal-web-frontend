import { Component, OnInit, ViewChild } from '@angular/core';
import { Team } from '../../models';
import { EntitiesService } from '../../entities.service';
import { SmartTableComponent } from '../../utils/table/smart-table.component';

@Component({
  selector: 'app-team-list',
  templateUrl: './team-list.component.html',
  styleUrls: ['./team-list.component.css']
})
export class TeamListComponent implements OnInit{
  public teams: Team[] | null = null;
  public search: string = '';
  @ViewChild(SmartTableComponent) smartTable: any;

  constructor(
    public entities: EntitiesService,
  ) {
  }

  ngOnInit(): void {
    this.entities.getTeams().subscribe((teams) => this.teams = teams);
  }

  public updateSearch(): void {
    this.smartTable.filterRows((row: Team) => {
      return row.searchable!.toLowerCase().includes(this.search.toLowerCase());
    });
  }
}
