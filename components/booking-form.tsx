import { createBookingAction, sendMessageAction } from '@/lib/actions';
import { formatWeekday } from '@/lib/utils';

type Rule = { id: string; dayOfWeek: number; startTime: string; endTime: string; enabled: boolean };
type Block = { id: string; blockedOn: Date; reason: string | null };

export function BookingForm({ bandId, depositPercentage, rules, blocks }: { bandId: string; depositPercentage: number; rules: Rule[]; blocks: Block[] }) {
  return (
    <div className="space-y-6">
      <form action={createBookingAction} className="rounded-[32px] border border-line bg-white p-6 shadow-sm">
        <input type="hidden" name="bandId" value={bandId} />
        <div className="mb-4">
          <h3 className="text-xl font-semibold">Request booking</h3>
          <p className="mt-1 text-sm text-muted">After the band confirms, the customer can pay a {depositPercentage}% Stripe deposit.</p>
        </div>
        <div className="grid gap-4">
          <input name="eventDate" type="date" className="rounded-2xl border border-line px-4 py-3" required />
          <div className="grid grid-cols-2 gap-3">
            <input name="startTime" type="time" className="rounded-2xl border border-line px-4 py-3" required />
            <input name="endTime" type="time" className="rounded-2xl border border-line px-4 py-3" required />
          </div>
          <input name="eventType" placeholder="Event type" className="rounded-2xl border border-line px-4 py-3" required />
          <input name="guestCount" type="number" min="1" placeholder="Guest count" className="rounded-2xl border border-line px-4 py-3" required />
          <input name="location" placeholder="Event location" className="rounded-2xl border border-line px-4 py-3" required />
          <textarea name="notes" rows={4} placeholder="Notes, song preferences, production details..." className="rounded-2xl border border-line px-4 py-3" />
        </div>
        <button className="mt-4 w-full rounded-2xl bg-ink px-4 py-3 font-semibold text-white">Send booking request</button>
      </form>

      <div className="rounded-[32px] border border-line bg-white p-6 shadow-sm">
        <h3 className="text-xl font-semibold">Weekly availability</h3>
        <div className="mt-4 space-y-2 text-sm text-muted">
          {rules.filter((rule) => rule.enabled).map((rule) => (
            <div key={rule.id} className="flex items-center justify-between rounded-2xl bg-soft px-4 py-3">
              <span>{formatWeekday(rule.dayOfWeek)}</span>
              <span>{rule.startTime} - {rule.endTime}</span>
            </div>
          ))}
        </div>
        {blocks.length > 0 ? (
          <div className="mt-4">
            <div className="mb-2 text-sm font-semibold">Blocked dates</div>
            <div className="space-y-2 text-sm text-muted">
              {blocks.slice(0, 6).map((block) => (
                <div key={block.id} className="rounded-2xl border border-line px-4 py-3">
                  {block.blockedOn.toISOString().slice(0, 10)}{block.reason ? ` · ${block.reason}` : ''}
                </div>
              ))}
            </div>
          </div>
        ) : null}
      </div>

      <form action={sendMessageAction} className="rounded-[32px] border border-line bg-white p-6 shadow-sm">
        <input type="hidden" name="bandId" value={bandId} />
        <h3 className="text-xl font-semibold">Message the band</h3>
        <textarea name="body" rows={4} placeholder="Ask about availability, songs, travel, pricing..." className="mt-4 w-full rounded-2xl border border-line px-4 py-3" />
        <button className="mt-4 w-full rounded-2xl bg-brand px-4 py-3 font-semibold text-white">Start conversation</button>
      </form>
    </div>
  );
}
