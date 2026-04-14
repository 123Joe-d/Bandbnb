import { prisma } from '@/lib/prisma';
import { BandCard } from '@/components/band-card';
import { SearchForm } from '@/components/search-form';

export default async function HomePage({
  searchParams
}: {
  searchParams?: { q?: string; city?: string };
}) {
  const q = searchParams?.q?.trim() ?? '';
  const city = searchParams?.city?.trim() ?? '';

  const bands = await prisma.band.findMany({
    where: {
      isPublished: true,
      AND: [
        q
          ? {
              OR: [
                { stageName: { contains: q } },
                { shortDescription: { contains: q } },
                { description: { contains: q } },
                { genresCsv: { contains: q } },
                { eventTypesCsv: { contains: q } }
              ]
            }
          : {},
        city
          ? {
              OR: [
                { city: { contains: city } },
                { state: { contains: city } },
                { locationLabel: { contains: city } }
              ]
            }
          : {}
      ]
    },
    orderBy: { createdAt: 'desc' }
  });

  return (
    <main>
      <section className="border-b border-line bg-soft">
        <div className="container-shell py-14 lg:py-20">
          <div className="max-w-3xl">
            <p className="mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-brand">Live music marketplace</p>
            <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">Book live bands with real accounts, real messaging, and real booking workflows.</h1>
            <p className="mt-4 text-lg text-muted">This version is structured to actually go live: customer accounts, band accounts, dashboards, database-backed bookings, installable PWA support, and a native-wrapper path for App Store and Google Play release.</p>
            <div className="mt-6 flex flex-wrap gap-3 text-sm">
              <span className="rounded-full border border-line bg-white px-4 py-2 font-semibold">PWA installable</span>
              <span className="rounded-full border border-line bg-white px-4 py-2 font-semibold">Capacitor native shell</span>
              <span className="rounded-full border border-line bg-white px-4 py-2 font-semibold">Stripe + Supabase</span>
            </div>
          </div>
          <div className="mt-8">
            <SearchForm />
          </div>
        </div>
      </section>

      <section className="container-shell py-10">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-semibold">Available bands</h2>
            <p className="text-muted">{bands.length} live listing{bands.length === 1 ? '' : 's'}</p>
          </div>
        </div>

        {bands.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-line bg-white p-10 text-center text-muted">No bands match this search yet.</div>
        ) : (
          <div className="grid gap-8 sm:grid-cols-2 xl:grid-cols-3">
            {bands.map((band) => (
              <BandCard key={band.id} band={band} />
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
