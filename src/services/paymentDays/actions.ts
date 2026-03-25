import { apiRequest } from '../apiClient';

export type PaymentDayCalendarItem = {
  date: string; // YYYY-MM-DD
  paidVia: 'WALLET' | 'BANK_TRANSFER';
  status: 'PAID' | 'MISSED';
};

export type PaymentDaysCalendarResponse = {
  days: PaymentDayCalendarItem[];
};

export async function getPaymentDaysCalendar(params: {
  from: string;
  to: string;
  signal?: AbortSignal;
}): Promise<PaymentDaysCalendarResponse> {
  const { from, to, signal } = params;
  const query = new URLSearchParams({ from, to });
  return apiRequest<PaymentDaysCalendarResponse>(`/api/v1/payment-days/calendar?${query.toString()}`, { signal });
}

export type PayPaymentDaysRequest = {
  dates: string[];
  paymentMethod: 'WALLET' | 'BANK_TRANSFER';
  transferReference?: string;
  proof?: File;
};

export type PayPaymentDaysResponse = {
  success: boolean;
};

export async function payPaymentDays(req: PayPaymentDaysRequest): Promise<PayPaymentDaysResponse> {
  if (req.paymentMethod === 'BANK_TRANSFER') {
    const form = new FormData();
    form.append('paymentMethod', req.paymentMethod);
    form.append('dates', JSON.stringify(req.dates));
    if (req.transferReference) form.append('transferReference', req.transferReference);
    if (req.proof) form.append('proof', req.proof);

    return apiRequest<PayPaymentDaysResponse>('/api/v1/payment-days/pay', {
      method: 'POST',
      body: form
    });
  }

  return apiRequest<PayPaymentDaysResponse>('/api/v1/payment-days/pay', {
    method: 'POST',
    body: {
      dates: req.dates,
      paymentMethod: req.paymentMethod
    }
  });
}
