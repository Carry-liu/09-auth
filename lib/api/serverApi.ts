import axios from 'axios';
import { cookies } from 'next/headers';

import type { Note, NoteTag } from '@/types/note';
import type { User } from '@/types/user';

const baseURL = process.env.NEXT_PUBLIC_API_URL + '/api';

interface FetchNotesParams {
  page: number;
  perPage: number;
  search?: string;
  tag?: NoteTag;
}

interface FetchNotesResponse {
  notes: Note[];
  totalPages: number;
}

async function getCookieHeader() {
  const cookieStore = await cookies();
  return cookieStore.toString();
}

export async function fetchNotes(params: FetchNotesParams): Promise<FetchNotesResponse> {
  const cookieHeader = await getCookieHeader();

  const res = await axios.get<FetchNotesResponse>(`${baseURL}/notes`, {
    headers: {
      Cookie: cookieHeader,
    },
    withCredentials: true,
    params: {
      page: params.page,
      perPage: params.perPage,
      search: params.search || undefined,
      tag: params.tag || undefined,
    },
  });

  return res.data;
}

export async function fetchNoteById(noteId: string): Promise<Note> {
  const cookieHeader = await getCookieHeader();

  const res = await axios.get<Note>(`${baseURL}/notes/${noteId}`, {
    headers: {
      Cookie: cookieHeader,
    },
    withCredentials: true,
  });

  return res.data;
}

export async function checkSession(): Promise<User | null> {
  const cookieHeader = await getCookieHeader();

  const res = await axios.get<User | null>(`${baseURL}/auth/session`, {
    headers: {
      Cookie: cookieHeader,
    },
    withCredentials: true,
  });

  return res.data;
}

export async function getMe(): Promise<User> {
  const cookieHeader = await getCookieHeader();

  const res = await axios.get<User>(`${baseURL}/users/me`, {
    headers: {
      Cookie: cookieHeader,
    },
    withCredentials: true,
  });

  return res.data;
}
