'use client';

import { useState } from 'react';
import Link from 'next/link';
import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { useDebouncedCallback } from 'use-debounce';

import css from './Notes.module.css';

import SearchBox from '@/components/SearchBox/SearchBox';
import Pagination from '@/components/Pagination/Pagination';
import NoteList from '@/components/NoteList/NoteList';
import Loader from '@/components/Loader/Loader';
import ErrorMessage from '@/components/ErrorMessage/ErrorMessage';

import { fetchNotes } from '@/lib/api';
import type { Note, NoteTag } from '@/types/note';

interface NotesClientProps {
  tag: NoteTag | null;
}

const PER_PAGE = 12;

export default function NotesClient({ tag }: NotesClientProps) {
  const [page, setPage] = useState<number>(1);
  const [searchInput, setSearchInput] = useState<string>('');
  const [search, setSearch] = useState<string>('');

  const debounced = useDebouncedCallback((value: string) => {
    setPage(1);
    setSearch(value.trim());
  }, 500);

  const handleSearchChange = (value: string) => {
    setSearchInput(value);
    debounced(value);
  };

  const { data, isPending, isError } = useQuery({
    queryKey: ['notes', page, search, tag ?? 'all'],
    queryFn: () =>
      fetchNotes({
        page,
        perPage: PER_PAGE,
        search,
        tag: tag ?? undefined,
      }),
    placeholderData: keepPreviousData,
  });

  const notes: Note[] = data?.notes ?? [];
  const totalPages: number = data?.totalPages ?? 0;

  return (
    <div className={css.app}>
      <header className={css.toolbar}>
        <SearchBox value={searchInput} onChange={handleSearchChange} />

        {totalPages > 1 && (
          <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
        )}

        <Link href="/notes/action/create" className={css.button}>
          Create note +
        </Link>
      </header>

      {isPending && <Loader />}

      {isError && !isPending && (
        <ErrorMessage message="Something went wrong. Notes cannot be displayed." />
      )}

      {!isPending && !isError && notes.length > 0 && <NoteList notes={notes} />}

      {!isPending && !isError && notes.length === 0 && <p>No notes found.</p>}
    </div>
  );
}
