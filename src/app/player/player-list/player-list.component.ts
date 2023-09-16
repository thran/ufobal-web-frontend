import { Component, OnInit } from '@angular/core';
import { EntitiesService } from '../../entities.service';
import { Player } from '../../models';

@Component({
  selector: 'app-player-list',
  templateUrl: './player-list.component.html',
  styleUrls: ['./player-list.component.css']
})
export class PlayerListComponent implements OnInit{
  public players: Player[] | null = null;

  constructor(
    public entities: EntitiesService,
  ) {
  }

  ngOnInit(): void {
    this.entities.getPlayers().subscribe((players) => this.players = players);
  }
}
