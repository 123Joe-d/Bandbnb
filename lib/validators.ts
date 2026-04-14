import { z } from 'zod';

export const registerSchema = z.object({
  name: z.string().min(2).max(60),
  email: z.string().email(),
  password: z.string().min(8).max(100),
  role: z.enum(['CUSTOMER', 'BAND'])
});

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8).max(100)
});

export const bandProfileSchema = z.object({
  stageName: z.string().min(2).max(80),
  city: z.string().min(2).max(60),
  state: z.string().min(2).max(60),
  priceFrom: z.coerce.number().int().min(100),
  members: z.coerce.number().int().min(1).max(50),
  shortDescription: z.string().min(20).max(180),
  description: z.string().min(80).max(5000),
  genresCsv: z.string().min(2).max(200),
  eventTypesCsv: z.string().min(2).max(300),
  bookingNotice: z.string().max(600).optional().default(''),
  cancellationPolicy: z.string().max(1000).optional().default(''),
  serviceRadiusMiles: z.coerce.number().int().min(1).max(500),
  depositPercentage: z.coerce.number().int().min(0).max(100),
  imageUrl: z.string().url().or(z.literal('')),
  coverUrl: z.string().url().or(z.literal(''))
});

export const bookingSchema = z.object({
  bandId: z.string().min(1),
  eventDate: z.string().min(1),
  startTime: z.string().min(1),
  endTime: z.string().min(1),
  eventType: z.string().min(2),
  guestCount: z.coerce.number().int().min(1).max(5000),
  location: z.string().min(2).max(120),
  notes: z.string().max(1200).optional().default('')
});

export const messageSchema = z.object({
  bandId: z.string().min(1),
  body: z.string().min(1).max(1500)
});
