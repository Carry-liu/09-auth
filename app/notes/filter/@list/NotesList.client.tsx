'use client';

import { keepPreviousData, useQuery } from '@tanstack/react-query';

import Loader from '@/components/Loader/Loader';
import ErrorMessage from '@/components/ErrorMessage/ErrorMessage';
import NoteList from '@/components/NoteList/NoteList';
import { fetchNotes } from '@/lib/api';

import type { Note, NoteTag } from '@/types/note';

const allowedTags: NoteTag[] = ['Todo', 'Work', 'Personal', 'Meeting', 'Shopping'];

interface NotesListClientProps {
  tag: string | null;
}

export default function NotesListClient({ tag }: NotesListClientProps) {
  const normalizedTag: NoteTag | undefined = allowedTags.includes(tag as NoteTag)
    ? (tag as NoteTag)
    : undefined;

  const { data, isPending, isError } = useQuery({
    queryKey: ['notes', 1, '', normalizedTag ?? 'all'],
    queryFn: () =>
      fetchNotes({
        page: 1,
        perPage: 12,
        search: '',
        tag: normalizedTag, // ✅ тільки валідний NoteTag або undefined
      }),
    placeholderData: keepPreviousData,
  });

  const notes: Note[] = data?.notes ?? [];

  if (isPending) return <Loader />;
  if (isError) return <ErrorMessage message="Could not fetch notes." />;

  if (!notes.length) return <p>No notes found.</p>;

  return <NoteList notes={notes} />;
}
