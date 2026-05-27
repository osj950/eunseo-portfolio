import Link from "next/link";
import { JournalPost } from "@/lib/types";

interface JournalCardProps {
  post: JournalPost;
}

export default function JournalCard({ post }: JournalCardProps) {
  return (
    <Link href={`/journal/${post.slug}`} className="group block border-b border-brown/10 py-6 last:border-0">
      <p className="font-sans text-xs text-brown/40 tracking-widest mb-2">{post.date}</p>
      <h3 className="font-myeongjo text-brown text-xl group-hover:text-red transition-colors mb-2">{post.title}</h3>
      <p className="font-sans text-sm text-brown/60 leading-relaxed line-clamp-2">{post.excerpt}</p>
    </Link>
  );
}
