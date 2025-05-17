import { Redirect } from "expo-router";

export default function Auth() {
  // Redirect to the login page by default
  return <Redirect href="/(auth)/login" />;
}