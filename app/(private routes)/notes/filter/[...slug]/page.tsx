import type { Metadata } from 'next';
import { QueryClient, dehydrate, HydrationBoundary } from '@tanstack/react-query';

import NotesClient from './Notes.client';
import { fetchNotes } from '@/lib/api';
import type { NoteTag } from '@/types/note';

interface FilterPageProps {
  params: Promise<{ slug: string[] }>;
}

const allowedTags: NoteTag[] = ['Todo', 'Work', 'Personal', 'Meeting', 'Shopping'];

export async function generateMetadata({ params }: FilterPageProps): Promise<Metadata> {
  const { slug } = await params;
  const raw = slug?.[0] ?? 'all';

  const filterLabel = raw === 'all' ? 'All notes' : raw;

  const title = `Notes — ${filterLabel} | NoteHub`;
  const description = `Browse notes filtered by: ${filterLabel}.`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: `https://notehub.app/notes/filter/${raw}`,
      images: ['https://ac.goit.global/fullstack/react/notehub-og-meta.jpg'],
    },
  };
}

export default async function FilterSlugPage({ params }: FilterPageProps) {
  const { slug } = await params;
  const raw = slug?.[0] ?? 'all';

  const tag: NoteTag | undefined =
    raw === 'all' ? undefined : allowedTags.includes(raw as NoteTag) ? (raw as NoteTag) : undefined;

  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: ['notes', 1, '', tag ?? 'all'],
    queryFn: () =>
      fetchNotes({
        page: 1,
        perPage: 12,
        search: '',
        tag,
      }),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <NotesClient tag={tag ?? null} />
    </HydrationBoundary>
  );
}
