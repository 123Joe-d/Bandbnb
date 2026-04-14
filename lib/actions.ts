'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { BookingStatus, Prisma, UserRole } from '@prisma/client';
import { clearSession, createSession, getSessionUser, hashPassword, requireUser, verifyPassword } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { getSupabaseAdmin } from '@/lib/supabase';
import { bandProfileSchema, bookingSchema, loginSchema, messageSchema, registerSchema } from '@/lib/validators';
import { safeFileName, slugify, toDateOnlyUtc } from '@/lib/utils';
import { validateBookingAgainstAvailability } from '@/lib/availability';

async function uploadBandAsset(file: File, folder: string) {
  if (!file || file.size === 0) return null;
  const supabase = getSupabaseAdmin();
  const bucket = process.env.SUPABASE_STORAGE_BUCKET || 'band-media';
  const path = `${folder}/${Date.now()}-${safeFileName(file.name || 'upload')}`;
  const arrayBuffer = await file.arrayBuffer();

  const { error } = await supabase.storage.from(bucket).upload(path, arrayBuffer, {
    contentType: file.type || 'application/octet-stream',
    upsert: true
  });

  if (error) throw new Error(`Upload failed: ${error.message}`);
  const { data } = supabase.storage.from(bucket).getPublicUrl(path);
  return data.publicUrl;
}

export async function registerAction(formData: FormData) {
  const parsed = registerSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { ok: false, message: parsed.error.issues[0]?.message ?? 'Invalid form.' };

  const existing = await prisma.user.findUnique({ where: { email: parsed.data.email.toLowerCase() } });
  if (existing) return { ok: false, message: 'This email is already registered.' };

  const user = await prisma.user.create({
    data: {
      name: parsed.data.name,
      email: parsed.data.email.toLowerCase(),
      passwordHash: await hashPassword(parsed.data.password),
      role: parsed.data.role as UserRole
    }
  });

  await createSession(user.id);
  if (user.role === 'BAND') redirect('/band/onboarding');
  redirect('/dashboard');
}

export async function loginAction(formData: FormData) {
  const parsed = loginSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { ok: false, message: 'Enter a valid email and password.' };

  const user = await prisma.user.findUnique({ where: { email: parsed.data.email.toLowerCase() } });
  if (!user) return { ok: false, message: 'Invalid email or password.' };

  const matches = await verifyPassword(parsed.data.password, user.passwordHash);
  if (!matches) return { ok: false, message: 'Invalid email or password.' };

  await createSession(user.id);

  if (user.role === 'BAND') {
    const band = await prisma.band.findUnique({ where: { ownerId: user.id } });
    redirect(band ? '/dashboard' : '/band/onboarding');
  }

  redirect('/dashboard');
}

export async function logoutAction() {
  clearSession();
  redirect('/');
}

export async function upsertBandProfileAction(formData: FormData) {
  const user = await requireUser();
  if (user.role !== 'BAND') return { ok: false, message: 'Only band accounts can create a band profile.' };

  const parsed = bandProfileSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { ok: false, message: parsed.error.issues[0]?.message ?? 'Invalid band profile.' };

  const data = parsed.data;
  const imageFile = formData.get('imageFile');
  const coverFile = formData.get('coverFile');

  const baseSlug = slugify(data.stageName);
  let slug = baseSlug;
  let counter = 1;
  while (true) {
    const existing = await prisma.band.findUnique({ where: { slug } });
    if (!existing || existing.ownerId === user.id) break;
    counter += 1;
    slug = `${baseSlug}-${counter}`;
  }

  const current = await prisma.band.findUnique({ where: { ownerId: user.id } });
  const imageUrl = imageFile instanceof File && imageFile.size > 0 ? await uploadBandAsset(imageFile, `bands/${user.id}/avatar`) : (data.imageUrl || current?.imageUrl || null);
  const coverUrl = coverFile instanceof File && coverFile.size > 0 ? await uploadBandAsset(coverFile, `bands/${user.id}/cover`) : (data.coverUrl || current?.coverUrl || null);

  const band = await prisma.band.upsert({
    where: { ownerId: user.id },
    create: {
      ownerId: user.id,
      stageName: data.stageName,
      slug,
      city: data.city,
      state: data.state,
      locationLabel: `${data.city}, ${data.state}`,
      priceFrom: data.priceFrom,
      members: data.members,
      shortDescription: data.shortDescription,
      description: data.description,
      genresCsv: data.genresCsv,
      eventTypesCsv: data.eventTypesCsv,
      bookingNotice: data.bookingNotice || null,
      cancellationPolicy: data.cancellationPolicy || null,
      serviceRadiusMiles: data.serviceRadiusMiles,
      depositPercentage: data.depositPercentage,
      imageUrl,
      coverUrl,
      isPublished: true
    },
    update: {
      stageName: data.stageName,
      slug,
      city: data.city,
      state: data.state,
      locationLabel: `${data.city}, ${data.state}`,
      priceFrom: data.priceFrom,
      members: data.members,
      shortDescription: data.shortDescription,
      description: data.description,
      genresCsv: data.genresCsv,
      eventTypesCsv: data.eventTypesCsv,
      bookingNotice: data.bookingNotice || null,
      cancellationPolicy: data.cancellationPolicy || null,
      serviceRadiusMiles: data.serviceRadiusMiles,
      depositPercentage: data.depositPercentage,
      imageUrl,
      coverUrl,
      isPublished: true
    }
  });

  const existingRules = await prisma.availabilityRule.count({ where: { bandId: band.id } });
  if (existingRules === 0) {
    await prisma.availabilityRule.createMany({
      data: [0, 1, 2, 3, 4, 5, 6].map((day) => ({
        bandId: band.id,
        dayOfWeek: day,
        startTime: day === 0 ? '12:00' : '09:00',
        endTime: day === 0 ? '20:00' : '23:00',
        enabled: day !== 1
      }))
    });
  }

  revalidatePath('/');
  revalidatePath('/dashboard');
  revalidatePath(`/bands/${band.slug}`);
  redirect('/band/studio');
}

export async function saveAvailabilityAction(formData: FormData) {
  const user = await requireUser();
  if (user.role !== 'BAND') return { ok: false, message: 'Only band accounts can edit availability.' };

  const band = await prisma.band.findUnique({ where: { ownerId: user.id } });
  if (!band) return { ok: false, message: 'Create your band profile first.' };

  const tx: Prisma.PrismaPromise<unknown>[] = [];
  for (const day of [0, 1, 2, 3, 4, 5, 6]) {
    const enabled = formData.get(`enabled_${day}`) === 'on';
    const startTime = String(formData.get(`startTime_${day}`) || '09:00');
    const endTime = String(formData.get(`endTime_${day}`) || '23:00');
    tx.push(prisma.availabilityRule.upsert({
      where: { bandId_dayOfWeek: { bandId: band.id, dayOfWeek: day } },
      create: { bandId: band.id, dayOfWeek: day, startTime, endTime, enabled },
      update: { startTime, endTime, enabled }
    }));
  }

  await prisma.$transaction(tx);
  revalidatePath('/band/studio');
  revalidatePath('/dashboard');
  return { ok: true, message: 'Availability updated.' };
}

export async function addBlockedDateAction(formData: FormData) {
  const user = await requireUser();
  if (user.role !== 'BAND') return { ok: false, message: 'Only band accounts can edit blocked dates.' };
  const band = await prisma.band.findUnique({ where: { ownerId: user.id } });
  if (!band) return { ok: false, message: 'Create your band profile first.' };

  const blockedOnRaw = String(formData.get('blockedOn') || '');
  if (!blockedOnRaw) return { ok: false, message: 'Choose a date to block.' };
  const reason = String(formData.get('reason') || '').trim();

  await prisma.availabilityBlock.upsert({
    where: { bandId_blockedOn: { bandId: band.id, blockedOn: toDateOnlyUtc(blockedOnRaw) } },
    create: { bandId: band.id, blockedOn: toDateOnlyUtc(blockedOnRaw), reason: reason || null },
    update: { reason: reason || null }
  });

  revalidatePath('/band/studio');
  revalidatePath(`/bands/${band.slug}`);
  return { ok: true, message: 'Date blocked.' };
}

export async function removeBlockedDateAction(formData: FormData) {
  const user = await requireUser();
  if (user.role !== 'BAND') return { ok: false, message: 'Only band accounts can edit blocked dates.' };
  const blockId = String(formData.get('blockId') || '');
  if (!blockId) return { ok: false, message: 'Missing blocked date id.' };

  await prisma.availabilityBlock.delete({ where: { id: blockId } });
  revalidatePath('/band/studio');
  return { ok: true, message: 'Blocked date removed.' };
}

export async function createBookingAction(formData: FormData) {
  const user = await requireUser();
  if (user.role !== 'CUSTOMER') return { ok: false, message: 'Only customers can submit booking requests.' };

  const parsed = bookingSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { ok: false, message: parsed.error.issues[0]?.message ?? 'Invalid booking details.' };

  const band = await prisma.band.findUnique({
    where: { id: parsed.data.bandId },
    include: {
      availabilityRules: true,
      availabilityBlocks: true,
      bookings: {
        select: { eventDate: true, startTime: true, endTime: true, status: true }
      }
    }
  });
  if (!band) return { ok: false, message: 'Band not found.' };

  const eventDate = toDateOnlyUtc(parsed.data.eventDate);
  const availabilityError = validateBookingAgainstAvailability({
    eventDate,
    startTime: parsed.data.startTime,
    endTime: parsed.data.endTime,
    rules: band.availabilityRules,
    blocks: band.availabilityBlocks,
    existingBookings: band.bookings
  });
  if (availabilityError) return { ok: false, message: availabilityError };

  const depositAmount = Math.round((band.priceFrom * band.depositPercentage) / 100);

  const booking = await prisma.booking.create({
    data: {
      bandId: band.id,
      customerId: user.id,
      eventDate,
      startTime: parsed.data.startTime,
      endTime: parsed.data.endTime,
      eventType: parsed.data.eventType,
      guestCount: parsed.data.guestCount,
      location: parsed.data.location,
      notes: parsed.data.notes,
      totalPrice: band.priceFrom,
      depositAmount,
      status: 'INQUIRY'
    }
  });

  const conversation = await prisma.conversation.upsert({
    where: { bandId_customerId: { bandId: band.id, customerId: user.id } },
    create: { bandId: band.id, customerId: user.id },
    update: {}
  });

  await prisma.message.create({
    data: {
      conversationId: conversation.id,
      senderId: user.id,
      body: `New booking inquiry for ${parsed.data.eventDate} (${parsed.data.startTime}-${parsed.data.endTime}), ${parsed.data.eventType}, ${parsed.data.location}.`
    }
  });

  await prisma.conversation.update({ where: { id: conversation.id }, data: { updatedAt: new Date() } });

  revalidatePath('/dashboard');
  revalidatePath('/bookings');
  revalidatePath('/messages');
  return { ok: true, message: `Booking request sent. Estimated deposit after approval: $${depositAmount}.` };
}

export async function sendMessageAction(formData: FormData) {
  const user = await requireUser();
  const parsed = messageSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { ok: false, message: 'Message cannot be empty.' };

  const band = await prisma.band.findUnique({ where: { id: parsed.data.bandId } });
  if (!band) return { ok: false, message: 'Band not found.' };
  if (user.role === 'BAND' && band.ownerId !== user.id) return { ok: false, message: 'Bands can only respond inside their own inbox.' };

  const customerId = user.role === 'CUSTOMER' ? user.id : String(formData.get('customerId') || '');
  if (!customerId) return { ok: false, message: 'Missing customer id.' };

  const conversation = await prisma.conversation.upsert({
    where: { bandId_customerId: { bandId: band.id, customerId } },
    create: { bandId: band.id, customerId },
    update: { updatedAt: new Date() }
  });

  await prisma.message.create({
    data: {
      conversationId: conversation.id,
      senderId: user.id,
      body: parsed.data.body
    }
  });

  await prisma.conversation.update({ where: { id: conversation.id }, data: { updatedAt: new Date() } });

  revalidatePath('/messages');
  revalidatePath('/dashboard');
  return { ok: true, message: 'Message sent.' };
}

export async function updateBookingStatusAction(formData: FormData) {
  const user = await requireUser();
  const bookingId = String(formData.get('bookingId') || '');
  const status = String(formData.get('status') || '') as BookingStatus;
  if (!bookingId || !status) return { ok: false, message: 'Missing booking status data.' };

  const booking = await prisma.booking.findUnique({
    where: { id: bookingId },
    include: { band: true }
  });
  if (!booking) return { ok: false, message: 'Booking not found.' };
  if (user.role !== 'BAND' || booking.band.ownerId !== user.id) return { ok: false, message: 'Not authorized.' };

  await prisma.booking.update({
    where: { id: bookingId },
    data: {
      status,
      paymentStatus: status === 'CONFIRMED' ? 'DEPOSIT_PENDING' : booking.paymentStatus
    }
  });

  revalidatePath('/dashboard');
  revalidatePath('/bookings');
  return { ok: true, message: status === 'CONFIRMED' ? 'Booking approved. Customer can now pay deposit.' : 'Booking updated.' };
}

export async function getCurrentViewer() {
  return getSessionUser();
}
