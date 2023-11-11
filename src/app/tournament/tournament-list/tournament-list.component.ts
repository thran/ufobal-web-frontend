import { Component, OnInit, ViewChild } from '@angular/core';
import { Team, Tournament } from '../../models';
import { EntitiesService } from '../../entities.service';
import { SmartTableComponent } from '../../utils/table/smart-table.component';

@Component({
  selector: 'app-tournament-list',
  templateUrl: './tournament-list.component.html',
  styleUrls: ['./tournament-list.component.css']
})
export class TournamentListComponent implements OnInit{
  public tournaments: Tournament[] | null = null;
  @ViewChild(SmartTableComponent) smartTable: any;

  constructor(
    public entities: EntitiesService,
  ) {
  }

  ngOnInit(): void {
    this.entities.getTournaments().subscribe((tournaments) => this.tournaments = tournaments);
  }
}
