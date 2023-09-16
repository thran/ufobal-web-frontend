import { Component, OnInit } from '@angular/core';
import { Tournament } from '../../models';
import { EntitiesService } from '../../entities.service';

@Component({
  selector: 'app-tournament-list',
  templateUrl: './tournament-list.component.html',
  styleUrls: ['./tournament-list.component.css']
})
export class TournamentListComponent implements OnInit{
  public tournaments: Tournament[] | null = null;

  constructor(
    public entities: EntitiesService,
  ) {
  }

  ngOnInit(): void {
    this.entities.getTournaments().subscribe((tournaments) => this.tournaments = tournaments);
  }
}
