import prisma from "@/lib/prisma";
import { ContactClient } from "@/components/public/ContactClient";

export const revalidate = 60;

export default async function ContactPage() {
  const settings = await prisma.globalSettings.findFirst();

  return <ContactClient settings={settings} />;
}
