import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { AngularFireDatabase } from '@angular/fire/database';
import { IUserGolfPicks, IGolferGrouping } from '../models/models';
import { TournamentConfig } from '../models/constants';
import { SportsApiService } from './sports-api.service';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class GolfDataStoreService {
  constructor(
    private fireDb: AngularFireDatabase,
    private sportsApi: SportsApiService,
    private authService: AuthService
  ) {}

  getGolferGroupings(): Observable<any> {
    const entityName = TournamentConfig.find((data) => data.active).groupName;
    return this.fireDb
      .list<IGolferGrouping>(entityName)
      .valueChanges()
      .pipe(
        map((groupings) => {
          return groupings[0];
        })
      );
  }

  getGolferPicks(): Observable<any> {
    return this.fireDb
      .list<IUserGolfPicks>('myGolfers')
      .valueChanges()
      .pipe(
        map((contestants: IUserGolfPicks[]) => {
          const filteredContestants = contestants.filter(
            (record) => record.eventId === this.sportsApi.getActiveEventId()
          );
          return filteredContestants;
        })
      );
  }

  loadUserPicks(): Observable<IUserGolfPicks> {
    return this.getGolferPicks().pipe(
      map((allUserPicks: IUserGolfPicks[]) => {
        const userPicks = allUserPicks.find(
          (picks) =>
            picks.eventId === this.sportsApi.getActiveEventId() &&
            picks.email === this.authService.getCurrentUser()
        );
        return userPicks;
      })
    );
  }

  updateGolferPicks(userPicks: IUserGolfPicks): void {
    this.fireDb
      .object(
        'myGolfers/' + this.sportsApi.getActiveEventId() + '-' + userPicks.team
      )
      .update(userPicks)
      .then((_) => {});
  }

  saveGolferPicks(userPicks: IUserGolfPicks): void {
    this.fireDb
      .list('myGolfers')
      .push(
        'myGolfers/' + this.sportsApi.getActiveEventId() + '-' + userPicks.team
      )
      .then((_) => {});
  }

  deleteGolferPicks(userPicks: IUserGolfPicks): void {
    this.fireDb
      .list('myGolfers')
      .remove(this.sportsApi.getActiveEventId() + '-' + userPicks.team)
      .then((_) => {});
  }
}
