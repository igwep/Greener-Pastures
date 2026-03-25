import { apiRequest } from '../apiClient';
import { uploadImageToCloudinary } from '../cloudinary';

export interface CreateDepositRequest {
  amountNaira: string | number;
  paymentMethod: 'BANK_TRANSFER';
  transferReference?: string;
  proof?: File;
  proofUrl?: string;
}

export interface CreateDepositResponse {
  success: boolean;
  deposit?: {
    id: string;
    amountNaira: string;
    status: string;
    createdAt: string;
  };
}

export async function createDeposit(data: CreateDepositRequest) {
  let proofUrl = data.proofUrl;

  // Upload proof to Cloudinary if file is provided
  if (data.proof && !proofUrl) {
    const cloudinaryResponse = await uploadImageToCloudinary(data.proof);
    proofUrl = cloudinaryResponse.secure_url;
  }

  const formData = new FormData();
  formData.append('amountNaira', String(data.amountNaira));
  formData.append('paymentMethod', data.paymentMethod);
  if (data.transferReference) {
    formData.append('transferReference', data.transferReference);
  }
  if (proofUrl) {
    formData.append('proofUrl', proofUrl);
  }

  return apiRequest<CreateDepositResponse>('/api/v1/deposits', {
    method: 'POST',
    body: formData
  });
}
