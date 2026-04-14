import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { BookingForm } from '@/components/booking-form';
import { currency, splitCsv } from '@/lib/utils';

export default async function BandDetailPage({ params }: { params: { slug: string } }) {
  const band = await prisma.band.findUnique({
    where: { slug: params.slug },
    include: { owner: true, availabilityRules: { orderBy: { dayOfWeek: 'asc' } }, availabilityBlocks: { orderBy: { blockedOn: 'asc' } } }
  });

  if (!band || !band.isPublished) notFound();

  const genres = splitCsv(band.genresCsv);
  const eventTypes = splitCsv(band.eventTypesCsv);

  return (
    <main className="container-shell py-10">
      <div className="mb-6 flex items-center gap-2 text-sm text-muted">
        <Link href="/" className="hover:text-ink">Browse</Link>
        <span>/</span>
        <span>{band.stageName}</span>
      </div>

      <div className="mb-8 overflow-hidden rounded-[32px]">
        <div className="grid gap-3 lg:grid-cols-[2fr_1fr]">
          <div className="relative min-h-[360px] overflow-hidden rounded-[32px] bg-slate-200">
            {band.coverUrl ? <Image src={band.coverUrl} alt={band.stageName} fill className="object-cover" /> : null}
          </div>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
            <div className="relative min-h-[176px] overflow-hidden rounded-[32px] bg-slate-200">
              {band.imageUrl ? <Image src={band.imageUrl} alt={`${band.stageName} performance`} fill className="object-cover" /> : null}
            </div>
            <div className="rounded-[32px] bg-white p-8 shadow-sm">
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-brand">Live band</p>
              <h1 className="mt-2 text-3xl font-semibold">{band.stageName}</h1>
              <p className="mt-2 text-muted">{band.locationLabel}</p>
              <div className="mt-6 flex flex-wrap gap-2">
                {genres.map((genre) => (
                  <span key={genre} className="rounded-full border border-line px-3 py-1 text-sm">{genre}</span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_420px]">
        <section className="space-y-8">
          <div className="rounded-3xl border border-line bg-white p-6 shadow-sm">
            <h2 className="text-2xl font-semibold">About this band</h2>
            <p className="mt-4 max-w-3xl leading-7 text-muted">{band.description}</p>
          </div>

          <div className="rounded-3xl border border-line bg-white p-6 shadow-sm">
            <h2 className="text-2xl font-semibold">Band information</h2>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <div className="rounded-2xl bg-soft p-4">
                <div className="text-sm text-muted">Members</div>
                <div className="mt-2 text-xl font-semibold">{band.members}</div>
              </div>
              <div className="rounded-2xl bg-soft p-4">
                <div className="text-sm text-muted">Starting price</div>
                <div className="mt-2 text-xl font-semibold">{currency(band.priceFrom)}</div>
              </div>
              <div className="rounded-2xl bg-soft p-4">
                <div className="text-sm text-muted">Service radius</div>
                <div className="mt-2 text-xl font-semibold">{band.serviceRadiusMiles} miles</div>
              </div>
              <div className="rounded-2xl bg-soft p-4">
                <div className="text-sm text-muted">Deposit</div>
                <div className="mt-2 text-xl font-semibold">{band.depositPercentage}%</div>
              </div>
              <div className="rounded-2xl bg-soft p-4 sm:col-span-2">
                <div className="text-sm text-muted">Best for</div>
                <div className="mt-3 flex flex-wrap gap-2">
                  {eventTypes.map((item) => (
                    <span key={item} className="rounded-full border border-line bg-white px-3 py-1 text-sm">{item}</span>
                  ))}
                </div>
              </div>
            </div>
            {band.bookingNotice ? <p className="mt-5 text-sm text-muted">Booking notice: {band.bookingNotice}</p> : null}
            {band.cancellationPolicy ? <p className="mt-2 text-sm text-muted">Cancellation policy: {band.cancellationPolicy}</p> : null}
          </div>
        </section>

        <aside>
          <BookingForm bandId={band.id} depositPercentage={band.depositPercentage} rules={band.availabilityRules} blocks={band.availabilityBlocks} />
        </aside>
      </div>
    </main>
  );
}
