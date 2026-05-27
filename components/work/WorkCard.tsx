import Image from "next/image";
import Link from "next/link";
import { Work } from "@/lib/types";

interface WorkCardProps {
  work: Work;
}

export default function WorkCard({ work }: WorkCardProps) {
  return (
    <Link href={`/work/${work.id}`} className="group block">
      <div className="aspect-[4/3] bg-brown/5 overflow-hidden mb-3">
        {work.thumbnail ? (
          <Image
            src={work.thumbnail}
            alt={work.title}
            width={600}
            height={450}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full bg-brown/10" />
        )}
      </div>
      <div>
        <p className="font-sans text-xs text-brown/50 tracking-widest uppercase mb-1">{work.category}</p>
        <h3 className="font-myeongjo text-brown text-lg leading-snug group-hover:text-red transition-colors">{work.title}</h3>
        <p className="font-sans text-sm text-brown/60 mt-1">{work.year}</p>
      </div>
    </Link>
  );
}
