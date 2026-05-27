import MainHeader from "@/components/layout/MainHeader";
import MainFooter from "@/components/layout/MainFooter";
import HeroSection from "@/components/sections/HeroSection";
import WorkSection from "@/components/sections/WorkSection";
import JournalSection from "@/components/sections/JournalSection";
import ContactSection from "@/components/sections/ContactSection";
import { getJournalPosts } from "@/lib/google-sheets";

export const revalidate = 60;

export default async function HomePage() {
  const posts = await getJournalPosts().catch(() => []);

  return (
    <>
      <MainHeader />
      <main>
        <HeroSection />
        <WorkSection />
        <JournalSection posts={posts} />
        <ContactSection />
      </main>
      <MainFooter />
    </>
  );
}
