import Link from 'next/link';
import { requireUser } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { addBlockedDateAction, removeBlockedDateAction, saveAvailabilityAction, upsertBandProfileAction } from '@/lib/actions';
import { formatDate, formatWeekday } from '@/lib/utils';

export default async function BandStudioPage() {
  const user = await requireUser();
  if (user.role !== 'BAND') {
    return (
      <main className="container-shell py-16">
        <div className="rounded-3xl border border-line bg-white p-8 shadow-sm">Only band accounts can access this page.</div>
      </main>
    );
  }

  const band = await prisma.band.findUnique({
    where: { ownerId: user.id },
    include: { availabilityRules: { orderBy: { dayOfWeek: 'asc' } }, availabilityBlocks: { orderBy: { blockedOn: 'asc' } } }
  });

  if (!band) {
    return (
      <main className="container-shell py-12">
        <div className="rounded-3xl border border-line bg-white p-8 shadow-sm">
          <h1 className="text-3xl font-semibold">Finish onboarding</h1>
          <p className="mt-2 text-muted">Create your band profile first.</p>
          <Link href="/band/onboarding" className="mt-6 inline-flex rounded-full bg-brand px-5 py-3 font-semibold text-white">Create listing</Link>
        </div>
      </main>
    );
  }

  return (
    <main className="container-shell space-y-8 py-10">
      <section className="rounded-3xl border border-line bg-white p-6 shadow-sm">
        <h1 className="text-3xl font-semibold">Band studio</h1>
        <p className="mt-2 text-muted">Edit your public listing, upload media to Supabase Storage, and control availability.</p>
      </section>

      <section className="rounded-3xl border border-line bg-white p-6 shadow-sm">
        <h2 className="text-2xl font-semibold">Edit public listing</h2>
        <form action={upsertBandProfileAction} className="mt-6 grid gap-4" encType="multipart/form-data">
          <div className="grid gap-4 md:grid-cols-2">
            <input name="stageName" defaultValue={band.stageName} placeholder="Stage name" className="rounded-2xl border border-line px-4 py-3" required />
            <input name="priceFrom" type="number" defaultValue={band.priceFrom} placeholder="Starting price" className="rounded-2xl border border-line px-4 py-3" required />
            <input name="city" defaultValue={band.city} placeholder="City" className="rounded-2xl border border-line px-4 py-3" required />
            <input name="state" defaultValue={band.state} placeholder="State" className="rounded-2xl border border-line px-4 py-3" required />
            <input name="members" type="number" defaultValue={band.members} placeholder="Members" className="rounded-2xl border border-line px-4 py-3" required />
            <input name="serviceRadiusMiles" type="number" defaultValue={band.serviceRadiusMiles} placeholder="Service radius miles" className="rounded-2xl border border-line px-4 py-3" required />
            <input name="depositPercentage" type="number" defaultValue={band.depositPercentage} placeholder="Deposit %" className="rounded-2xl border border-line px-4 py-3" required />
            <input name="genresCsv" defaultValue={band.genresCsv} placeholder="Genres (comma separated)" className="rounded-2xl border border-line px-4 py-3" required />
            <input name="eventTypesCsv" defaultValue={band.eventTypesCsv} placeholder="Event types (comma separated)" className="rounded-2xl border border-line px-4 py-3 md:col-span-2" required />
            <input name="imageUrl" defaultValue={band.imageUrl ?? ''} placeholder="Fallback image URL" className="rounded-2xl border border-line px-4 py-3" />
            <input name="coverUrl" defaultValue={band.coverUrl ?? ''} placeholder="Fallback cover URL" className="rounded-2xl border border-line px-4 py-3" />
            <label className="rounded-2xl border border-dashed border-line px-4 py-3">
              <div className="mb-2 text-sm font-semibold">Upload avatar image</div>
              <input name="imageFile" type="file" accept="image/*" className="block w-full text-sm" />
            </label>
            <label className="rounded-2xl border border-dashed border-line px-4 py-3">
              <div className="mb-2 text-sm font-semibold">Upload cover image</div>
              <input name="coverFile" type="file" accept="image/*" className="block w-full text-sm" />
            </label>
          </div>
          <textarea name="shortDescription" defaultValue={band.shortDescription} rows={3} placeholder="Short description" className="rounded-2xl border border-line px-4 py-3" required />
          <textarea name="description" defaultValue={band.description} rows={6} placeholder="Full description" className="rounded-2xl border border-line px-4 py-3" required />
          <textarea name="bookingNotice" defaultValue={band.bookingNotice ?? ''} rows={2} placeholder="Booking notice" className="rounded-2xl border border-line px-4 py-3" />
          <textarea name="cancellationPolicy" defaultValue={band.cancellationPolicy ?? ''} rows={3} placeholder="Cancellation policy" className="rounded-2xl border border-line px-4 py-3" />
          <button className="w-full rounded-2xl bg-brand px-4 py-4 font-semibold text-white">Save listing</button>
        </form>
      </section>

      <section className="grid gap-8 lg:grid-cols-2">
        <div className="rounded-3xl border border-line bg-white p-6 shadow-sm">
          <h2 className="text-2xl font-semibold">Weekly availability</h2>
          <form action={saveAvailabilityAction} className="mt-6 space-y-4">
            {band.availabilityRules.map((rule) => (
              <div key={rule.id} className="grid gap-3 rounded-2xl border border-line p-4 md:grid-cols-[140px_1fr_1fr] md:items-center">
                <label className="flex items-center gap-3 font-semibold"><input type="checkbox" name={`enabled_${rule.dayOfWeek}`} defaultChecked={rule.enabled} /> {formatWeekday(rule.dayOfWeek)}</label>
                <input name={`startTime_${rule.dayOfWeek}`} type="time" defaultValue={rule.startTime} className="rounded-2xl border border-line px-4 py-3" />
                <input name={`endTime_${rule.dayOfWeek}`} type="time" defaultValue={rule.endTime} className="rounded-2xl border border-line px-4 py-3" />
              </div>
            ))}
            <button className="w-full rounded-2xl bg-ink px-4 py-4 font-semibold text-white">Save availability</button>
          </form>
        </div>

        <div className="rounded-3xl border border-line bg-white p-6 shadow-sm">
          <h2 className="text-2xl font-semibold">Blocked dates</h2>
          <form action={addBlockedDateAction} className="mt-6 space-y-4">
            <input name="blockedOn" type="date" className="w-full rounded-2xl border border-line px-4 py-3" required />
            <input name="reason" placeholder="Reason (optional)" className="w-full rounded-2xl border border-line px-4 py-3" />
            <button className="w-full rounded-2xl bg-ink px-4 py-4 font-semibold text-white">Add blocked date</button>
          </form>
          <div className="mt-6 space-y-3">
            {band.availabilityBlocks.length === 0 ? (
              <p className="text-sm text-muted">No blocked dates yet.</p>
            ) : band.availabilityBlocks.map((block) => (
              <div key={block.id} className="flex items-center justify-between rounded-2xl border border-line px-4 py-3">
                <div>
                  <div className="font-semibold">{formatDate(block.blockedOn)}</div>
                  {block.reason ? <div className="text-sm text-muted">{block.reason}</div> : null}
                </div>
                <form action={removeBlockedDateAction}>
                  <input type="hidden" name="blockId" value={block.id} />
                  <button className="rounded-full border border-line px-4 py-2 text-sm font-semibold">Remove</button>
                </form>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
