export type NigerianBank = {
  id: string;
  name: string;
  slug: string;
  code: string;
  ussd: string;
};

export type NigerianBanksResponse = NigerianBank[];

export async function getNigerianBanks(): Promise<NigerianBanksResponse> {
  const res = await fetch('https://supermx1.github.io/nigerian-banks-api/data.json');
  if (!res.ok) {
    throw new Error(`Failed to fetch Nigerian banks: ${res.status}`);
  }
  const data = (await res.json()) as unknown;
  if (!Array.isArray(data)) {
    throw new Error('Invalid Nigerian banks response: expected array');
  }
  return data as NigerianBanksResponse;
}
