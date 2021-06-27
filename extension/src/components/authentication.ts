import * as firebase from 'firebase/app';
/*
Uses the chrome.identity api to retrieve and user access token,
which can then be used to sign the user into our firebase application.
*/

interface BaseAuthResult {
  status: AuthStatus;
}

export enum AuthStatus {
  Success,
  Failure
}

export interface SuccessAuthResult extends BaseAuthResult {
  status: AuthStatus.Success;
  user: firebase.UserInfo | null;
}

export interface FailureAuthResult extends BaseAuthResult {
  status: AuthStatus.Failure;
  error: { code?: string; message: string }
}

export type AuthResult = SuccessAuthResult | FailureAuthResult

const createAuthSuccess = (userCred: firebase.auth.UserCredential): AuthResult => ({
  status: AuthStatus.Success,
  user: userCred.user as firebase.UserInfo,
});

const createAuthFailure = (message: string, code?: string): AuthResult => ({
  status: AuthStatus.Failure,
  error: { message, code }
});

export const authToFirebase = (): Promise<AuthResult> => {
  const interactive = true;

  return new Promise((resolve, reject) => {
    chrome.identity.getAuthToken({interactive: interactive}, (token: string) => {
      if(token == undefined) {
        reject(createAuthFailure('Error retrieving your token from Chrome.'));
      } else if (chrome.runtime.lastError && !interactive) {
        reject(createAuthFailure('It was not possible to get a token programmatically.'));
      } else if(chrome.runtime.lastError) {
        reject(createAuthFailure(chrome.runtime.lastError.message));
      } else if (token) {
        // Authorize Firebase with the OAuth Access Token.
        const credential = firebase.auth.GoogleAuthProvider.credential(null, token);

        return firebase.auth().signInWithCredential(credential)
          .then(
            successCredential => resolve(createAuthSuccess(successCredential)),
            err => {
              // The OAuth token might have been invalidated. Lets' remove it from cache.
              if (err.code === 'auth/invalid-credential') {
                chrome.identity.removeCachedAuthToken({token: token}, function() {
                  return authToFirebase(); // Retry on errors
                });
              } else {
                reject(createAuthFailure(err));
              }
            });
      } else {
        reject(createAuthFailure('The OAuth Token was null'));
      }
    });
  });
};
