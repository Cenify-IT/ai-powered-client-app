import { headers } from "next/headers";

export async function getDomain() {
  const host = (await headers()).get("host");

  // remove localhost port in dev
  return host?.replace(":3000", "");
}
