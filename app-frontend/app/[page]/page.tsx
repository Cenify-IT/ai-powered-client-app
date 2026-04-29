import { getDomain } from "../lib/domains";

export default async function Page({ params }: any) {
  const domain = await getDomain();

  // continue logic
}
