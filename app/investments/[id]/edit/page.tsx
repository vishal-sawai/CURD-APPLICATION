'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter, useParams } from 'next/navigation';
import InvestmentForm from '@/components/InvestmentForm';

export default function EditInvestmentPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const params = useParams();
  const investmentId = params.id as string;

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    }
  }, [status, router]);

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Edit Investment</h1>
        <InvestmentForm investmentId={investmentId} />
      </div>
    </div>
  );
}
