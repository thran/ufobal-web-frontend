import { Component, NgModule } from '@angular/core';
import { RouterModule, Routes } from "@angular/router";
import { HomeComponent } from './home/home.component';
import { FaqComponent } from './faq/faq.component';
import { PrivacyPolicyComponent } from './privacy-policy/privacy-policy.component';
import { HallOfRecordsComponent } from './stats/hall-of-records/hall-of-records.component';
import { PlayerListComponent } from './player/player-list/player-list.component';
import { PlayerDetailComponent } from './player/player-detail/player-detail.component';
import { TeamListComponent } from './team/team-list/team-list.component';
import { TeamDetailComponent } from './team/team-detail/team-detail.component';
import { TournamentListComponent } from './tournament/tournament-list/tournament-list.component';
import { TournamentDetailComponent } from './tournament/tournament-detail/tournament-detail.component';
import { TournamentGroupsComponent } from './tournament/tournament-groups/tournament-groups.component';
import { StatsCanadaComponent } from './stats/stats-canada/stats-canada.component';
import { StatsGoaliesComponent } from './stats/stats-goalies/stats-goalies.component';
import { TournamentComponent } from './record/tournament/tournament.component';
import { MatchComponent } from './record/match/match.component';
import { RegisterComponent } from './record/register/register.component';
import { TeamOnTournamentComponent } from './record/team-on-tournament/team-on-tournament.component';


@Component({selector: 'app-page-not-found', templateUrl: './page-not-found.html'})
export class PageNotFoundComponent{}


const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'faq', component: FaqComponent },
  { path: 'privacy_policy', component: PrivacyPolicyComponent },

  { path: 'players', component: PlayerListComponent },
  { path: 'player/:playerId', component: PlayerDetailComponent },
  { path: 'teams', component: TeamListComponent },
  { path: 'team/:teamId', component: TeamDetailComponent },
  { path: 'tournaments', component: TournamentListComponent },
  { path: 'tournament/:tournamentId', component: TournamentDetailComponent },
  { path: 'tournament/:tournamentId/groups', component: TournamentGroupsComponent },
  { path: 'tournament/:tournamentId/:teamId', component: TournamentDetailComponent },

  { path: 'hall_of_records', component: HallOfRecordsComponent },
  { path: 'stats/canada', component: StatsCanadaComponent },
  { path: 'stats/goalies', component: StatsGoaliesComponent },

  { path: 'record/:tournamentId', component: TournamentComponent },
  { path: 'record/:tournamentId/register', component: RegisterComponent },
  { path: 'record/:tournamentId/team/:teamId', component: TeamOnTournamentComponent },
  { path: 'record/:tournamentId/match/:matchId', component: MatchComponent },

  { path: '**', component: PageNotFoundComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {bindToComponentInputs: true})],
  exports: [RouterModule]
})
export class AppRoutingModule { }

