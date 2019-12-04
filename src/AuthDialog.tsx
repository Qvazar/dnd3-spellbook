import React from 'react';
import AuthUi from './firebase/AuthUi';

const AuthDialog: React.FC = () => (
    <AuthUi onSignIn={console.log} />
);

export default AuthDialog;