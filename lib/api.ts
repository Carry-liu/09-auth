import axios from 'axios';
import type { Note, NoteTag } from '@/types/note';

const api = axios.create({
  baseURL: 'https://notehub-public.goit.study/api',
});

api.interceptors.request.use((config) => {
  const token = process.env.NEXT_PUBLIC_NOTEHUB_TOKEN as string | undefined;
  if (!token) throw new Error('Missing NEXT_PUBLIC_NOTEHUB_TOKEN');

  config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export interface FetchNotesParams {
  page: number;
  perPage: number;
  search?: string;
  tag?: NoteTag;
}

interface FetchNotesResponse {
  notes: Note[];
  totalPages: number;
}

interface CreateNoteBody {
  title: string;
  content: string;
  tag: NoteTag;
}

export async function fetchNotes(params: FetchNotesParams): Promise<FetchNotesResponse> {
  const res = await api.get<FetchNotesResponse>('/notes', {
    params: {
      page: params.page,
      perPage: params.perPage,
      search: params.search?.trim() || undefined,
      tag: params.tag || undefined,
    },
  });

  return res.data;
}

export async function createNote(body: CreateNoteBody): Promise<Note> {
  const res = await api.post<Note>('/notes', body);
  return res.data;
}

export async function deleteNote(noteId: string): Promise<Note> {
  const res = await api.delete<Note>(`/notes/${noteId}`);
  return res.data;
}

export async function fetchNoteById(noteId: string): Promise<Note> {
  const res = await api.get<Note>(`/notes/${noteId}`);
  return res.data;
}
