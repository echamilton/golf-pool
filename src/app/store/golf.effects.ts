import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Observable } from 'rxjs';
import { Action } from '@ngrx/store';
import * as golfActions from './golf.actions';
import { map, mergeMap } from 'rxjs/operators';
import {
  IGolferGroupingsUI,
  IGolfersGroupPick,
  ITournamentResults
} from './../models/models';
import { SportsApiService } from '../services/sports-api.service';
import { GolfDataStoreService } from '../services/golf-data-store.service';

@Injectable()
export class UserEffects {
  constructor(
    private actions$: Actions,
    private sportsApi: SportsApiService,
    private golfData: GolfDataStoreService
  ) {}

  getTournamentData$: Observable<Action> = createEffect(() => this.actions$.pipe(
    ofType(golfActions.GolfActionTypes.GetTournamentDataLoad),
    mergeMap(() =>
      this.sportsApi.getGolfScores().pipe(
        map((tournamentResults: ITournamentResults) => {
          return new golfActions.GetTournamentSuccess(tournamentResults);
        })
      )
    ))
  );


  getGolferGroupings$: Observable<Action> = createEffect(() => this.actions$.pipe(
    ofType(golfActions.GolfActionTypes.GetGolferGroupings),
    mergeMap(() =>
      this.golfData.getGolferGroupings().pipe(
        map((golfGroupings) => {
          return new golfActions.GetGolferGroupingsComplete(
            this.filterGolfGroupings(golfGroupings)
          );
        })
      )
    ))
  );

  private filterGolfGroupings(groupingsFromDB: any[]): IGolferGroupingsUI {
    const golferGroupings: IGolferGroupingsUI = {
      groupA: [],
      groupB: [],
      groupC: []
    };
    if (groupingsFromDB) {
      groupingsFromDB.forEach((golfer) => {
        const golferPick: IGolfersGroupPick = {
          id: golfer.golferId,
          name: golfer.name
        };

        if (golfer.group == 'A') {
          golferGroupings.groupA.push(golferPick);
        } else if (golfer.group == 'B') {
          golferGroupings.groupB.push(golferPick);
        } else {
          golferGroupings.groupC.push(golferPick);
        }
      });
      return golferGroupings;
    }
    return null;
  }
}
