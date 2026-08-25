import { MessageCircle } from "lucide-react";
import { whatsappLink, GENERAL_ENQUIRY } from "./whatsapp";

export function WhatsAppFab() {
  return (
    <a
      href={whatsappLink(GENERAL_ENQUIRY)}
      target="_blank"
      rel="noreferrer"
      aria-label="Chat with St. Claire's on WhatsApp"
      className="fixed right-4 bottom-5 z-40 inline-flex size-14 items-center justify-center rounded-full bg-whatsapp text-whatsapp-foreground shadow-lg transition-transform hover:scale-105"
    >
      <MessageCircle className="size-6" aria-hidden />
    </a>
  );
}
