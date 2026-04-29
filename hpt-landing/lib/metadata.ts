import type { Metadata } from 'next';

const OG_IMAGE = {
  url: 'https://www.happytalk.io/images/og-image.jpg',
  width: 1200,
  height: 630,
};

export function createOpenGraph({
  title,
  description,
  url,
}: {
  title: string;
  description: string;
  url: string;
}): Metadata['openGraph'] {
  return {
    type: 'website',
    siteName: '해피톡',
    title,
    description,
    url,
    images: [OG_IMAGE],
  };
}
