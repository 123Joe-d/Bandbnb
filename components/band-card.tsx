import Link from 'next/link';
import { Band } from '@prisma/client';
import { currency, splitCsv } from '@/lib/utils';

export function BandCard({ band }: { band: Band }) {
  const genres = splitCsv(band.genresCsv).slice(0, 3);

  return (
    <article className="overflow-hidden rounded-3xl border border-line bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-card">
      <div className="relative aspect-[4/3] bg-slate-200">
        {band.imageUrl ? (
          <img
            src={band.imageUrl}
            alt={band.stageName}
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-2xl font-semibold text-slate-500">
            {band.stageName}
          </div>
        )}
      </div>

      <div className="space-y-3 p-5">
        <div>
          <h3 className="text-xl font-semibold">{band.stageName}</h3>
          <p className="text-slate-500">{band.locationLabel}</p>
        </div>

        <p className="text-slate-600">{band.shortDescription}</p>

        <div className="flex flex-wrap gap-2">
          {genres.map((genre) => (
            <span
              key={genre}
              className="rounded-full bg-slate-100 px-3 py-1 text-sm text-slate-600"
            >
              {genre}
            </span>
          ))}
        </div>

        <div className="flex items-center justify-between">
          <span className="font-semibold">{currency(band.priceFrom)} / starting</span>
          <Link
            href={`/bands/${band.slug}`}
            className="text-sm font-medium text-slate-900 underline"
          >
            View
          </Link>
        </div>
      </div>
    </article>
  );
}