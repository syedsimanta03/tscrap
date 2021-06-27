import '@testing-library/jest-dom';
import { render, waitFor } from '@testing-library/react';
import React from 'react';
import {
  AuthResult,
  AuthStatus,
  FailureAuthResult,
  SuccessAuthResult
} from '../authentication';
import SignInButton from './index';

describe('SignInButton', () => {
  const buildMockAuthFn = (mockResult: AuthResult) => (
    jest.fn<Promise<AuthResult>, []>(() => (Promise.resolve(mockResult)))
  );

  it('displays sign-in button by default', () => {
    const testResult: FailureAuthResult = {
      status: AuthStatus.Failure,
      error: { message: 'mock auth failed!' }
    };

    const { getByText } = render(
      <SignInButton
        authFn={buildMockAuthFn(testResult)}
      />
    );

    expect(getByText(/Sign in using/)).toBeInTheDocument();
  });

  it('automatically signs in user and displays profile image if authFn succeeds ', async () => {
    const testResult: SuccessAuthResult = {
      status: AuthStatus.Success,
      user: {
        displayName: 'foo',
        email: 'foo@gmail',
        phoneNumber: '999',
        photoURL: 'my/profile/photo',
        providerId: 'goog',
        uid: '123'
      }
    };

    const { getByTestId } = render(
      <SignInButton
        authFn={buildMockAuthFn(testResult)}
      />
    );

    await waitFor(() => {
      expect(getByTestId('profile-img-test-id')).toBeInTheDocument();
    });
  });
});
