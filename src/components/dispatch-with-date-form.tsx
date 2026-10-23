'use client';

import React, { useState } from 'react';
import { useFormStatus } from 'react-dom';
import { useRouter } from 'next/navigation';
import { Truck } from 'lucide-react';

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="px-3 py-1.5 bg-brand-crimson hover:bg-brand-crimson/95 text-white font-bold rounded-lg text-xs flex items-center gap-1.5 cursor-pointer border-0 shadow-xs disabled:opacity-60 min-h-[32px] transition-all"
    >
      {pending ? (
        'Dispatching...'
      ) : (
        <>
          <Truck size={14} />
          <span>Dispatch</span>
        </>
      )}
    </button>
  );
}

export default function DispatchWithDateForm({ orderId }: { orderId: string }) {
  const router = useRouter();
  const [date, setDate] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const today = new Date().toISOString().split('T')[0];
  const inputId = `delivery-date-${orderId}`;

  return (
    <form
      action={async (formData) => {
        const dateValue = formData.get('estimatedDeliveryDate') as string;
        if (!dateValue || isSubmitting) return;
        setIsSubmitting(true);
        try {
          const res = await fetch('/api/admin/orders/dispatch', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              orderId,
              estimatedDeliveryDate: dateValue,
            }),
          });
          if (res.ok) {
            router.refresh();
          }
        } catch (err) {
          console.error('Failed to dispatch order:', err);
        } finally {
          setIsSubmitting(false);
        }
      }}
      className="flex items-center gap-1.5"
    >
      <label htmlFor={inputId} className="sr-only">
        Estimated Delivery Date
      </label>
      <input
        id={inputId}
        type="date"
        name="estimatedDeliveryDate"
        required
        min={today}
        defaultValue={date || today}
        onChange={(e) => setDate(e.target.value)}
        aria-label="Estimated Delivery Date"
        className="px-2.5 py-1.5 bg-background border border-border rounded-lg text-xs font-medium text-foreground focus:outline-none focus:ring-2 focus:ring-brand-crimson min-h-[32px]"
      />
      <SubmitButton />
    </form>
  );
}
