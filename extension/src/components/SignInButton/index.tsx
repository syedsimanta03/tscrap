import * as firebase from 'firebase/app';
import 'firebase/auth';
import React, { useEffect, useState } from 'react';
import { AuthResult, AuthStatus } from '../authentication';

type AppUser = firebase.UserInfo | null;

type AuthenticationFn = () => Promise<AuthResult>;

type SignInButtonProps = {
  authFn: AuthenticationFn
}

const SignInButton = ({ authFn }: SignInButtonProps): JSX.Element => {

  const [appUser, setAppUser] = useState<AppUser>(null);

  useEffect(() => {
    const doAuth = async (auth: AuthenticationFn) => {
      const authResult = await auth();

      switch (authResult.status) {
        case AuthStatus.Success:
          setAppUser(authResult.user);
          break;
        case AuthStatus.Failure:
          console.log(
            `Error: Unable to authenticate user: ${authResult.error.message}, ${authResult.error.code}`
          );
          break;
      }
    };

    doAuth(authFn);
  }, []);

  return appUser ? (
    <div data-testid="profile-img-test-id" id="profile-image-container">
      <img src={appUser.photoURL} id="profile-image" />
    </div>
  ) : (
    <button>Sign in using Google!</button>
  );
};

export default SignInButton;
