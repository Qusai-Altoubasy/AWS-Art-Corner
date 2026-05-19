import { fetchAuthSession } from "aws-amplify/auth";

export async function authSession(): Promise<string | undefined> {
  try {
    const session = await fetchAuthSession();

    return session.tokens?.idToken?.toString();
  } catch (error) {
    return;
  }
}
