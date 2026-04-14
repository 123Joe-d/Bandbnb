import { AvailabilityBlock, AvailabilityRule, Booking } from '@prisma/client';

function toMinutes(time: string) {
  const [h, m] = time.split(':').map(Number);
  return h * 60 + m;
}

function sameUtcDate(a: Date, b: Date) {
  return a.getUTCFullYear() === b.getUTCFullYear() && a.getUTCMonth() === b.getUTCMonth() && a.getUTCDate() === b.getUTCDate();
}

export function isTimeRangeValid(startTime: string, endTime: string) {
  return toMinutes(endTime) > toMinutes(startTime);
}

export function overlaps(startA: string, endA: string, startB: string, endB: string) {
  return toMinutes(startA) < toMinutes(endB) && toMinutes(startB) < toMinutes(endA);
}

export function validateBookingAgainstAvailability({
  eventDate,
  startTime,
  endTime,
  rules,
  blocks,
  existingBookings
}: {
  eventDate: Date;
  startTime: string;
  endTime: string;
  rules: AvailabilityRule[];
  blocks: AvailabilityBlock[];
  existingBookings: Array<Pick<Booking, 'eventDate' | 'startTime' | 'endTime' | 'status'>>;
}) {
  if (!isTimeRangeValid(startTime, endTime)) {
    return 'End time must be after start time.';
  }

  const day = eventDate.getUTCDay();
  const rule = rules.find((item) => item.dayOfWeek === day && item.enabled);
  if (!rule) return 'This band is not available on that day.';
  if (toMinutes(startTime) < toMinutes(rule.startTime) || toMinutes(endTime) > toMinutes(rule.endTime)) {
    return `This band accepts bookings on that day between ${rule.startTime} and ${rule.endTime}.`;
  }

  const isBlocked = blocks.some((item) => sameUtcDate(item.blockedOn, eventDate));
  if (isBlocked) return 'This date is blocked on the band calendar.';

  const conflict = existingBookings.some((booking) => {
    const active = ['PENDING', 'CONFIRMED', 'COMPLETED'].includes(booking.status);
    return active && sameUtcDate(booking.eventDate, eventDate) && overlaps(startTime, endTime, booking.startTime, booking.endTime);
  });

  if (conflict) return 'This time conflicts with an existing booking.';
  return null;
}
