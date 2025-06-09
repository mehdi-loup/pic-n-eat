import { create } from 'ipfs-http-client';

// Replace these with your actual values
const PINATA_JWT = process.env.NEXT_PUBLIC_PINATA_JWT || '';
const PINATA_GATEWAY = process.env.NEXT_PUBLIC_PINATA_GATEWAY || 'https://gateway.pinata.cloud/ipfs/';

// Create IPFS client with your JWT
const ipfs = create({
  url: 'https://api.pinata.cloud/pinning/pinFileToIPFS',
  headers: {
    Authorization: `Bearer ${PINATA_JWT}`
  }
});

export const pinataGateway = PINATA_GATEWAY;

export async function uploadToIPFS(file: File) {
  try {
    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch('https://api.pinata.cloud/pinning/pinFileToIPFS', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${PINATA_JWT}`
      },
      body: formData
    });

    if (!response.ok) {
      throw new Error('Failed to upload to IPFS');
    }

    const data = await response.json();
    return data.IpfsHash;
  } catch (error) {
    console.error('Error uploading to IPFS:', error);
    throw error;
  }
}

export function getIPFSURL(hash: string) {
  return `${pinataGateway}${hash}`;
} 