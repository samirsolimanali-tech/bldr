'use client';

import { BldrFooter } from '@bldr/ui';

export default function Footer({ lang = 'EN' }: { lang?: 'EN' | 'AR' }) {
  return <BldrFooter lang={lang} />;
}

