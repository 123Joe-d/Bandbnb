import { Conversation, Message, User, Band } from '@prisma/client';
import { sendMessageAction } from '@/lib/actions';
import { formatDate } from '@/lib/utils';

type ConversationWithRelations = Conversation & {
  band: Band;
  customer: User;
  messages: Array<Message & { sender: User }>;
};

export function MessageCenter({
  conversations,
  viewerRole,
  viewerId,
  selectedId
}: {
  conversations: ConversationWithRelations[];
  viewerRole: string;
  viewerId: string;
  selectedId?: string;
}) {
  const active = conversations.find((item) => item.id === selectedId) ?? conversations[0];

  return (
    <div className="grid overflow-hidden rounded-[32px] border border-line bg-white shadow-sm lg:grid-cols-[320px_minmax(0,1fr)]">
      <aside className="border-r border-line">
        <div className="border-b border-line p-4 font-semibold">Inbox</div>
        <div className="max-h-[70vh] overflow-y-auto">
          {conversations.length === 0 ? (
            <p className="p-4 text-sm text-muted">No conversations yet.</p>
          ) : (
            conversations.map((conversation) => {
              const title = viewerRole === 'CUSTOMER' ? conversation.band.stageName : conversation.customer.name;
              const preview = conversation.messages[conversation.messages.length - 1]?.body ?? 'No messages yet';
              return (
                <a
                  key={conversation.id}
                  href={`/messages?conversation=${conversation.id}`}
                  className={`block border-b border-line p-4 transition hover:bg-slate-50 ${active?.id === conversation.id ? 'bg-soft' : ''}`}
                >
                  <div className="font-semibold">{title}</div>
                  <p className="mt-1 line-clamp-2 text-sm text-muted">{preview}</p>
                </a>
              );
            })
          )}
        </div>
      </aside>

      <section className="flex min-h-[70vh] flex-col">
        {active ? (
          <>
            <div className="border-b border-line p-5">
              <h2 className="text-xl font-semibold">
                {viewerRole === 'CUSTOMER' ? active.band.stageName : active.customer.name}
              </h2>
              <p className="text-sm text-muted">Conversation started {formatDate(active.createdAt)}</p>
            </div>
            <div className="flex-1 space-y-4 overflow-y-auto p-5">
              {active.messages.map((message) => {
                const mine = message.senderId === viewerId;
                return (
                  <div key={message.id} className={`flex ${mine ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[75%] rounded-3xl px-4 py-3 ${mine ? 'bg-ink text-white' : 'bg-slate-100 text-ink'}`}>
                      <div className="text-sm">{message.body}</div>
                    </div>
                  </div>
                );
              })}
            </div>
            <form action={sendMessageAction} className="border-t border-line p-4">
              <input type="hidden" name="bandId" value={active.bandId} />
              {viewerRole === 'BAND' ? <input type="hidden" name="customerId" value={active.customerId} /> : null}
              <div className="flex gap-3">
                <input name="body" placeholder="Write a message..." className="flex-1 rounded-2xl border border-line px-4 py-3 outline-none" />
                <button className="rounded-2xl bg-brand px-5 py-3 font-semibold text-white">Send</button>
              </div>
            </form>
          </>
        ) : (
          <div className="flex h-full items-center justify-center p-8 text-muted">Start a conversation from a band page.</div>
        )}
      </section>
    </div>
  );
}
