'use client';

import Link from 'next/link';
import { useState } from 'react';
import { registerAction } from '@/lib/actions';

export default function RegisterPage() {
  const [role, setRole] = useState<'CUSTOMER' | 'BAND'>('CUSTOMER');

  return (
    <main className="container-shell max-w-md py-16">
      <div className="rounded-[32px] border border-line bg-white p-8 shadow-card">

        <h1 className="text-3xl font-semibold">Create account</h1>
        <p className="mt-2 text-muted">
          Join as a customer or start earning as a band.
        </p>

        {/* 👇 身份选择（核心升级） */}
        <div className="mt-6 grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() => setRole('CUSTOMER')}
            className={`rounded-2xl border px-4 py-3 text-sm font-semibold ${
              role === 'CUSTOMER'
                ? 'border-black bg-black text-white'
                : 'border-line bg-white'
            }`}
          >
            I’m a customer
          </button>

          <button
            type="button"
            onClick={() => setRole('BAND')}
            className={`rounded-2xl border px-4 py-3 text-sm font-semibold ${
              role === 'BAND'
                ? 'border-black bg-black text-white'
                : 'border-line bg-white'
            }`}
          >
            I’m a band
          </button>
        </div>

        {/* 👇 表单 */}
        <form action={registerAction} className="mt-8 space-y-4">

          <input type="hidden" name="role" value={role} />

          <label className="block">
            <div className="mb-2 font-semibold">
              {role === 'BAND' ? 'Band name' : 'Full name'}
            </div>
            <input
              name="name"
              className="w-full rounded-2xl border border-line px-4 py-3"
              required
            />
          </label>

          <label className="block">
            <div className="mb-2 font-semibold">Email</div>
            <input
              name="email"
              type="email"
              className="w-full rounded-2xl border border-line px-4 py-3"
              required
            />
          </label>

          <label className="block">
            <div className="mb-2 font-semibold">Password</div>
            <input
              name="password"
              type="password"
              className="w-full rounded-2xl border border-line px-4 py-3"
              required
            />
          </label>

          <button
            type="submit"
            className="w-full rounded-2xl bg-brand px-4 py-4 font-semibold text-white"
          >
            {role === 'BAND' ? 'Create band account' : 'Create account'}
          </button>
        </form>

        <p className="mt-6 text-sm text-muted">
          Already have an account?{' '}
          <Link href="/login" className="font-semibold text-brand">
            Log in
          </Link>
        </p>
      </div>
    </main>
  );
}