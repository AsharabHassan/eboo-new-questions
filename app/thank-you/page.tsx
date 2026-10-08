import { LeadConfirmation } from "@/components/lead-confirmation";
import { metaLeadConfig } from "@/lib/meta-lead";

export const dynamic = "force-dynamic";
export const metadata = { title: "Enquiry received", robots: { index: false, follow: false } };

export default function ThankYouPage() {
  const { enabled, pixelId } = metaLeadConfig();
  return <LeadConfirmation enabled={enabled} pixelId={pixelId} />;
}
