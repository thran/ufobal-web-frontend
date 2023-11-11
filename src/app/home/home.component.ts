import { Component, OnInit } from '@angular/core';
import { EntitiesService } from '../entities.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit{

  constructor(
    private entities: EntitiesService,
  ) {
  }

  ngOnInit(): void {
    // this.entities.getPlayers().subscribe((players) => console.log(players));
    // this.entities.getTeams().subscribe((teams) => console.log(teams));
    // let tournament = null;
    // this.entities.getTournament(101).subscribe((t) => {tournament = t; console.log(tournament)});

    // this.entities.getPlayersWithGoalStats().subscribe((players) => console.log(players));

    setTimeout(() => {
      // this.entities.getTournament(101).subscribe((tournament) => console.log(tournament));
      // this.entities.refreshTournament(tournament!).subscribe((tournament) => console.log(tournament));
    }, 3000);

  }


}
