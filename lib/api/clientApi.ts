import { api } from './api';
import type { Note, NoteTag } from '@/types/note';
import type { User } from '@/types/user';

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

interface AuthCredentials {
  email: string;
  password: string;
}

interface CreateNoteBody {
  title: string;
  content: string;
  tag: NoteTag;
}

interface UpdateUserBody {
  username: string;
}

export async function fetchNotes(params: FetchNotesParams): Promise<FetchNotesResponse> {
  const res = await api.get<FetchNotesResponse>('/notes', {
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
  const res = await api.get<Note>(`/notes/${noteId}`);
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

export async function register(body: AuthCredentials): Promise<User> {
  const res = await api.post<User>('/auth/register', body);
  return res.data;
}

export async function login(body: AuthCredentials): Promise<User> {
  const res = await api.post<User>('/auth/login', body);
  return res.data;
}

export async function logout(): Promise<void> {
  await api.post('/auth/logout');
}

export async function checkSession(): Promise<User | null> {
  const res = await api.get<User | null>('/auth/session');
  return res.data;
}

export async function getMe(): Promise<User> {
  const res = await api.get<User>('/users/me');
  return res.data;
}

export async function updateMe(body: UpdateUserBody): Promise<User> {
  const res = await api.patch<User>('/users/me', body);
  return res.data;
}
