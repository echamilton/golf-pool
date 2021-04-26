// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,

  firebase: {
    apiKey: 'AIzaSyABOO_Xt0f-Y52mib9D79Kog95osDxuY50',
    authDomain: 'legbreaker-app.firebaseapp.com',
    databaseURL: 'https://legbreaker-app.firebaseio.com',
    projectId: 'legbreaker-app',
    storageBucket: 'legbreaker-app.appspot.com',
    messagingSenderId: '727660903518'
  }
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
