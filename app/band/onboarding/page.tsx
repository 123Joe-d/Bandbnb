import { requireUser } from '@/lib/auth';
import { upsertBandProfileAction } from '@/lib/actions';

export default async function BandOnboardingPage() {
  const user = await requireUser();

  return (
    <main className="container-shell max-w-4xl py-12">
      <div className="rounded-[32px] border border-line bg-white p-8 shadow-card">
        <h1 className="text-3xl font-semibold">Create your band listing</h1>
        <p className="mt-2 text-muted">Welcome, {user.name}. Fill out your public band profile so customers can discover and book you.</p>

        <form action={upsertBandProfileAction} className="mt-8 grid gap-4" encType="multipart/form-data">
          <input name="stageName" placeholder="Band name" className="rounded-2xl border border-line px-4 py-3" required />
          <div className="grid gap-4 md:grid-cols-2">
            <input name="city" placeholder="City" className="rounded-2xl border border-line px-4 py-3" required />
            <input name="state" placeholder="State" className="rounded-2xl border border-line px-4 py-3" required />
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <input name="priceFrom" type="number" min="100" placeholder="Starting price" className="rounded-2xl border border-line px-4 py-3" required />
            <input name="members" type="number" min="1" placeholder="Number of members" className="rounded-2xl border border-line px-4 py-3" required />
            <input name="serviceRadiusMiles" type="number" min="1" placeholder="Service radius miles" className="rounded-2xl border border-line px-4 py-3" required />
            <input name="depositPercentage" type="number" min="0" max="100" placeholder="Deposit percentage" className="rounded-2xl border border-line px-4 py-3" required />
          </div>
          <input name="shortDescription" placeholder="Short description" className="rounded-2xl border border-line px-4 py-3" required />
          <textarea name="description" rows={6} placeholder="Full description" className="rounded-2xl border border-line px-4 py-3" required />
          <input name="genresCsv" placeholder="Genres, comma separated" className="rounded-2xl border border-line px-4 py-3" required />
          <input name="eventTypesCsv" placeholder="Event types, comma separated" className="rounded-2xl border border-line px-4 py-3" required />
          <textarea name="bookingNotice" rows={2} placeholder="Booking notice" className="rounded-2xl border border-line px-4 py-3" />
          <textarea name="cancellationPolicy" rows={3} placeholder="Cancellation policy" className="rounded-2xl border border-line px-4 py-3" />
          <div className="grid gap-4 md:grid-cols-2">
            <input name="imageUrl" placeholder="Main image URL (optional)" className="rounded-2xl border border-line px-4 py-3" />
            <input name="coverUrl" placeholder="Cover image URL (optional)" className="rounded-2xl border border-line px-4 py-3" />
            <label className="rounded-2xl border border-dashed border-line px-4 py-3">
              <div className="mb-2 text-sm font-semibold">Upload avatar image</div>
              <input name="imageFile" type="file" accept="image/*" className="block w-full text-sm" />
            </label>
            <label className="rounded-2xl border border-dashed border-line px-4 py-3">
              <div className="mb-2 text-sm font-semibold">Upload cover image</div>
              <input name="coverFile" type="file" accept="image/*" className="block w-full text-sm" />
            </label>
          </div>
          <button className="rounded-2xl bg-brand px-4 py-4 font-semibold text-white">Publish listing</button>
        </form>
      </div>
    </main>
  );
}
