import bcrypt from 'bcryptjs';
import { PrismaClient, UserRole } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  await prisma.message.deleteMany();
  await prisma.conversation.deleteMany();
  await prisma.booking.deleteMany();
  await prisma.availabilityBlock.deleteMany();
  await prisma.availabilityRule.deleteMany();
  await prisma.band.deleteMany();
  await prisma.user.deleteMany();

  const passwordHash = await bcrypt.hash('demo12345', 10);

  const customer = await prisma.user.create({
    data: {
      name: 'Demo Customer',
      email: 'customer@bandbnb.com',
      passwordHash,
      role: UserRole.CUSTOMER,
      phone: '555-101-2020'
    }
  });

  const bandOwner = await prisma.user.create({
    data: {
      name: 'Midnight Metro Manager',
      email: 'band@bandbnb.com',
      passwordHash,
      role: UserRole.BAND,
      phone: '555-909-8080'
    }
  });

  const band = await prisma.band.create({
    data: {
      ownerId: bandOwner.id,
      stageName: 'Midnight Metro',
      slug: 'midnight-metro',
      city: 'New York',
      state: 'NY',
      locationLabel: 'New York, NY',
      priceFrom: 1800,
      members: 4,
      shortDescription: 'Sophisticated jazz and soul for weddings, cocktails, and private events.',
      description: 'Midnight Metro is a polished live band built for premium private events. The group performs jazz standards, soul classics, and tasteful modern arrangements for weddings, hotels, rooftop events, and brand activations.',
      genresCsv: 'Jazz,Soul,Lounge',
      eventTypesCsv: 'Wedding,Cocktail Party,Corporate Event,Private Dinner',
      bookingNotice: 'Please book at least 3 weeks in advance for Saturday weddings.',
      cancellationPolicy: 'Deposit is non-refundable within 14 days of the performance date.',
      serviceRadiusMiles: 60,
      depositPercentage: 25,
      imageUrl: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?auto=format&fit=crop&w=900&q=80',
      coverUrl: 'https://images.unsplash.com/photo-1501386761578-eac5c94b800a?auto=format&fit=crop&w=1400&q=80',
      isPublished: true
    }
  });

  await prisma.availabilityRule.createMany({
    data: [
      { bandId: band.id, dayOfWeek: 0, startTime: '12:00', endTime: '21:00', enabled: true },
      { bandId: band.id, dayOfWeek: 1, startTime: '09:00', endTime: '17:00', enabled: false },
      { bandId: band.id, dayOfWeek: 2, startTime: '12:00', endTime: '22:00', enabled: true },
      { bandId: band.id, dayOfWeek: 3, startTime: '12:00', endTime: '22:00', enabled: true },
      { bandId: band.id, dayOfWeek: 4, startTime: '12:00', endTime: '23:00', enabled: true },
      { bandId: band.id, dayOfWeek: 5, startTime: '14:00', endTime: '23:30', enabled: true },
      { bandId: band.id, dayOfWeek: 6, startTime: '14:00', endTime: '23:30', enabled: true }
    ]
  });

  await prisma.availabilityBlock.create({
    data: {
      bandId: band.id,
      blockedOn: new Date('2026-07-04T00:00:00.000Z'),
      reason: 'Already committed to an out-of-town festival.'
    }
  });

  const convo = await prisma.conversation.create({
    data: {
      bandId: band.id,
      customerId: customer.id
    }
  });

  await prisma.message.createMany({
    data: [
      {
        conversationId: convo.id,
        senderId: customer.id,
        body: 'Hi! Are you available for a 2026 summer rooftop party in Manhattan?'
      },
      {
        conversationId: convo.id,
        senderId: bandOwner.id,
        body: 'Yes, we still have some June dates available. What is the guest count and event vibe?'
      }
    ]
  });

  await prisma.booking.create({
    data: {
      bandId: band.id,
      customerId: customer.id,
      eventDate: new Date('2026-06-18T00:00:00.000Z'),
      startTime: '18:00',
      endTime: '21:00',
      eventType: 'Corporate Event',
      guestCount: 120,
      location: 'Midtown Manhattan',
      notes: 'Need a classy set for cocktail hour and dinner.',
      totalPrice: 2400,
      depositAmount: 600,
      status: 'CONFIRMED',
      paymentStatus: 'DEPOSIT_PENDING'
    }
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
