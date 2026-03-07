import NotePreview from '@/components/NotePreview/NotePreview';

export default function NoteModalPage({ params }: { params: { id: string } }) {
  return <NotePreview id={params.id} />;
}
