import Image from "next/image";
import Link from "next/link";
import RichText from "../utils/RichText";

export default function Footer({ data }) {
  const {
    Logo,
    links,
    LinksSection,
    socialLinks,
    additionalSection,
    bottomCopyright,
  } = data;

  return (
    <footer className="bg-slate-50 pt-16 pb-8 border-t border-slate-200">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          {/* Brand Column */}
          <div className="col-span-1 md:col-span-1">
            {/* Logo */}
            <div>
              {console.log("Logo data:", Logo)}
              {Logo.imageUrl ? (
                <div className="w-[100%] h-[100px]">
                  <Image
                    src={Logo.imageUrl}
                    width={100}
                    height={100}
                    alt="Company Logo"
                  />
                </div>
              ) : (
                <div>
                  <Link href="/">
                    <RichText content={Logo?.logoJsonText || []} />
                  </Link>
                </div>
              )}
            </div>
          </div>

          {/* Links Columns */}
          {LinksSection.map((section, index) => (
            <div key={index}>
              <RichText content={section.Title} />
              <ul className="space-y-4 mt-4 text-sm text-slate-600">
                {console.log("Links for section:", section)}
                {section.Links.sublinks.map((link, idx) => (
                  <li
                    key={idx}
                    className={
                      section.Links.classNames ||
                      "hover:text-red-600 cursor-pointer"
                    }
                  >
                    <Link href={link.href}>{link.label}</Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* Additional Section */}
          <div>
            <RichText content={additionalSection} />
          </div>
        </div>

        <div className={bottomCopyright.classNames || "text-center"}>
          <RichText content={bottomCopyright.data} />
        </div>
      </div>
    </footer>
  );
}
