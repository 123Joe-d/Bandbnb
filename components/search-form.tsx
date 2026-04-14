'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useState } from 'react';

export function SearchForm() {
  const params = useSearchParams();
  const router = useRouter();
  const [search, setSearch] = useState(params.get('q') ?? '');
  const [city, setCity] = useState(params.get('city') ?? '');

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        const next = new URLSearchParams();
        if (search.trim()) next.set('q', search.trim());
        if (city.trim()) next.set('city', city.trim());
        router.push(`/?${next.toString()}`);
      }}
      className="rounded-[28px] border border-line bg-white p-3 shadow-card"
    >
      <div className="grid gap-3 md:grid-cols-[1.4fr_1fr_auto]">
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search bands, genres, or event types"
          className="rounded-2xl border border-line px-4 py-3 outline-none"
        />
        <input
          value={city}
          onChange={(e) => setCity(e.target.value)}
          placeholder="City or state"
          className="rounded-2xl border border-line px-4 py-3 outline-none"
        />
        <button className="rounded-2xl bg-brand px-6 py-3 font-semibold text-white">Explore</button>
      </div>
    </form>
  );
}
