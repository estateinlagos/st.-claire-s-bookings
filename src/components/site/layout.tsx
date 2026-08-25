import type { ReactNode } from "react";
import { Header } from "./header";
import { Footer } from "./footer";
import { WhatsAppFab } from "./whatsapp-fab";

export function SiteLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
      <WhatsAppFab />
    </div>
  );
}

export function PageHeader({
  eyebrow,
  title,
  intro,
}: {
  eyebrow?: string;
  title: string;
  intro?: string;
}) {
  return (
    <section className="mx-auto max-w-6xl px-5 pt-14 pb-10 md:pt-20">
      {eyebrow && <p className="eyebrow">{eyebrow}</p>}
      <h1 className="mt-3 max-w-3xl text-4xl leading-[1.05] md:text-6xl">{title}</h1>
      {intro && (
        <p className="mt-5 max-w-2xl text-base text-muted-foreground md:text-lg">
          {intro}
        </p>
      )}
    </section>
  );
}
