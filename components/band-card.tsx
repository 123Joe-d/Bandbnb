import Image from 'next/image';
import Link from 'next/link';
import { Band } from '@prisma/client';
import { currency, splitCsv } from '@/lib/utils';

export function BandCard({ band }: { band: Band }) {
  const genres = splitCsv(band.genresCsv).slice(0, 3);

  return (
    <article className="overflow-hidden rounded-3xl border border-line bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-card">
      <div className="relative aspect-[4/3] bg-slate-200">
        {band.imageUrl ? (
          <Image src={band.imageUrl} alt={band.stageName} fill className="object-cover" />
        ) : (
          <div className="flex h-full items-center justify-center text-2xl font-semibold text-slate-500">{band.stageName}</div>
        )}
      </div>
      <div className="space-y-3 p-5">
        <div>
          <h3 className="text-xl font-semibold">{band.stageName}</h3>
          <p className="text-sm text-muted">{band.locationLabel}</p>
        </div>
        <p className="line-clamp-2 text-sm text-muted">{band.shortDescription}</p>
        <div className="flex flex-wrap gap-2">
          {genres.map((genre) => (
            <span key={genre} className="rounded-full border border-line px-3 py-1 text-xs">
              {genre}
            </span>
          ))}
        </div>
        <div className="flex items-center justify-between pt-2">
          <p>
            <span className="font-semibold">{currency(band.priceFrom)}</span>
            <span className="text-sm text-muted"> / starting</span>
          </p>
          <Link href={`/bands/${band.slug}`} className="rounded-full bg-ink px-4 py-2 text-sm font-semibold text-white">
            View
          </Link>
        </div>
      </div>
    </article>
  );
}
