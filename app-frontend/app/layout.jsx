import { getDomain } from "./lib/domains";
import Header from "./components/layout/Header";
import Footer from "./components/layout/Footer";
import "./globals.css";
import { ThemeProvider } from "./context/theme/context";
import { AIChatProvider } from "./context/ai-chat/context";
import ChatBubble from "./components/utils/Chat";

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
    return <div>Failed to load site</div>;
  }

  const website = await res.json();

  const page = website.pages.find((p) => p.title === "Home");

  if (!page) return <div>Website not found</div>;
  const layout = website.layout;

  const headerData = layout.find(
    (item) => item.__component === "layout.header",
  );

  const footerData = layout.find(
    (item) => item.__component === "layout.footer",
  );

  const themeData = layout.find((item) => item.__component === "layout.theme");

  return (
    <ThemeProvider initialTheme={themeData?.colors || {}}>
      <AIChatProvider chatbot={website.chatbot}>
        <html lang="en">
          <body className="min-h-full flex flex-col">
            <Header data={headerData} />
            {children}
            <Footer data={footerData} />
          </body>
        </html>
        <ChatBubble chatbot={website.chatbot} />
      </AIChatProvider>
    </ThemeProvider>
  );
}
