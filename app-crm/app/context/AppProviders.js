import { AuthProvider } from "./auth/context";
import { WebsiteProvider } from "./website/context";

export const AppProviders = ({ children }) => {
  return (
    <AuthProvider>
      <WebsiteProvider>{children}</WebsiteProvider>
    </AuthProvider>
  );
};
export default AppProviders;
