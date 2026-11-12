import { getDomain } from "./lib/domains";
import Header from "./components/layout/Header";
import Footer from "./components/layout/Footer";
import "./globals.css";
import { ThemeProvider } from "./context/theme/context";
import { AIChatProvider } from "./context/ai-chat/context";
import ChatBubble from "./components/utils/Chat";
import CMSSafelist from "./cms-safelist";
import VisitorTracker from "./lib/visitorTracker";
import { Toaster } from "react-hot-toast";

export default async function RootLayout({ children }) {
  const domain = await getDomain();

  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

  const res = await fetch(
    `${baseUrl}/api/website?domain=${domain}&populate[pages][populate][sections][populate]=*&populate[layout][populate]=*&populate[chatbot][populate][chatbot_intents]=*`,
    {
      next: { revalidate: 60 },
    },
  );

  if (!res.ok) {
    return (
      <html lang="en">
        <body>
          <div>Failed to load site</div>
        </body>
      </html>
    );
  }

  const website = await res.json();
  const client = website.client || {};

  const page = website.pages.find((p) => p.title === "Home");

  if (!page) {
    return (
      <html lang="en">
        <body>Website not found</body>
      </html>
    );
  }
  const layout = website.layout;

  const headerData = layout.find(
    (item) => item.__component === "layout.header",
  );

  const footerData = layout.find(
    (item) => item.__component === "layout.footer",
  );
  console.log("Client Data in RootLayout", client);
  const themeData = layout.find((item) => item.__component === "layout.theme");

  return (
    <ThemeProvider initialTheme={themeData?.colors || {}}>
      <Toaster position="top-right" />
      <VisitorTracker domain={domain} />
      <AIChatProvider chatbot={website.chatbot}>
        <html lang="en">
          <body className="min-h-full flex flex-col">
            <CMSSafelist /> {/* Invisible to users, visible to Tailwind */}
            <Header data={headerData} />
            {children}
            <Footer data={footerData} client={client} />
          </body>
        </html>
        <ChatBubble chatbot={website.chatbot} />
      </AIChatProvider>
    </ThemeProvider>
  );
}
