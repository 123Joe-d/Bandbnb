import { requireUser } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { MessageCenter } from '@/components/message-center';

export default async function MessagesPage({ searchParams }: { searchParams?: { conversation?: string } }) {
  const user = await requireUser();

  const conversations = await prisma.conversation.findMany({
    where: user.role === 'BAND' ? { band: { ownerId: user.id } } : { customerId: user.id },
    include: {
      band: true,
      customer: true,
      messages: {
        include: { sender: true },
        orderBy: { createdAt: 'asc' }
      }
    },
    orderBy: { updatedAt: 'desc' }
  });

  return (
    <main className="container-shell py-10">
      <div className="mb-6">
        <h1 className="text-3xl font-semibold">Messages</h1>
        <p className="mt-2 text-muted">Chat between customers and bands using real database-backed conversations.</p>
      </div>
      <MessageCenter conversations={conversations as never} viewerRole={user.role} viewerId={user.id} selectedId={searchParams?.conversation} />
    </main>
  );
}
