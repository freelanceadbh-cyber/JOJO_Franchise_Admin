'use client';

import React, { useState } from 'react';
import { useFormStatus } from 'react-dom';
import { Truck } from 'lucide-react';

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="px-3 py-1.5 bg-brand-crimson hover:bg-brand-crimson/95 text-white font-bold rounded-lg text-[10px] flex items-center gap-1.5 cursor-pointer border-0 shadow-sm disabled:opacity-60"
    >
      {pending ? (
        'Dispatching...'
      ) : (
        <>
          <Truck size={12} />
          Dispatch
        </>
      )}
    </button>
  );
}

export default function DispatchWithDateForm({ orderId }: { orderId: string }) {
  const [date, setDate] = useState('');
  const today = new Date().toISOString().split('T')[0];

  return (
    <form
      action={async (formData) => {
        const dateValue = formData.get('estimatedDeliveryDate') as string;
        if (!dateValue) return;
        await fetch('/api/admin/orders/dispatch', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            orderId,
            estimatedDeliveryDate: dateValue,
          }),
        });
        window.location.reload();
      }}
      className="flex items-center gap-1.5"
    >
      <input
        type="date"
        name="estimatedDeliveryDate"
        required
        min={today}
        defaultValue={date || today}
        onChange={(e) => setDate(e.target.value)}
        className="px-2 py-1.5 bg-white border border-border rounded-lg text-[10px] font-medium text-foreground focus:outline-none focus:ring-2 focus:ring-brand-crimson"
      />
      <SubmitButton />
    </form>
  );
}
