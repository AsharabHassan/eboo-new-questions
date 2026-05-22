import { Nav } from "@/components/nav";
import { Hero } from "@/components/hero";
import { Ticker } from "@/components/ticker";
import { Mechanism } from "@/components/mechanism";
import { VideoTestimonial } from "@/components/video-testimonial";
import { ReviewsSlider } from "@/components/reviews-slider";
import { Closing } from "@/components/closing";
import { SiteFooter } from "@/components/site-footer";
import { StickyMobileCTA } from "@/components/sticky-mobile-cta";

export default function Page() {
  return (
    <main className="relative">
      <Nav />
      <Hero />
      <Ticker />
      <Mechanism />
      <VideoTestimonial />
      <ReviewsSlider />
      <Closing />
      <SiteFooter />
      <StickyMobileCTA />
    </main>
  );
}
