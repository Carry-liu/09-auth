import NotesListClient from '../NotesList.client';

export default function TagListPage({ params }: { params: { tag: string[] } }) {
  const raw = params.tag?.[0] ?? 'all';
  const tag = raw === 'all' ? null : raw;
  return <NotesListClient tag={tag} />;
}
