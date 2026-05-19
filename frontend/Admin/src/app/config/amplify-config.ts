import { Amplify } from "aws-amplify";

const amplifyConfig = {
  Auth: {
    Cognito: {
      userPoolId: import.meta.env.VITE_COGNITO_USER_POOL_ID as string,
      userPoolClientId: import.meta.env.VITE_COGNITO_APP_CLIENT_ID as string,
      region: import.meta.env.VITE_AWS_REGION as string,
    },
  },
};

Amplify.configure(amplifyConfig);
export default amplifyConfig;
