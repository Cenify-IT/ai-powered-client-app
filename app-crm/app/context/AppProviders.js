import { AuthProvider } from "./auth/context";

// import { }
export const AppProviders = ({ children }) => {
  return <AuthProvider>{children}</AuthProvider>;
};
export default AppProviders;
