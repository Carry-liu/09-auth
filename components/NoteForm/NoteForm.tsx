'use client';

import { useRouter } from 'next/navigation';
import { useMutation, useQueryClient } from '@tanstack/react-query';

import css from './NoteForm.module.css';
import { createNote } from '@/lib/api/clientApi';
import { initialDraft, useNoteStore } from '@/lib/store/noteStore';
import type { NoteTag } from '@/types/note';

const tags: NoteTag[] = ['Todo', 'Work', 'Personal', 'Meeting', 'Shopping'];

export default function NoteForm() {
  const router = useRouter();
  const queryClient = useQueryClient();

  const draft = useNoteStore((state) => state.draft);
  const setDraft = useNoteStore((state) => state.setDraft);
  const clearDraft = useNoteStore((state) => state.clearDraft);

  const mutation = useMutation({
    mutationFn: createNote,
    onSuccess: async () => {
      clearDraft();
      await queryClient.invalidateQueries({ queryKey: ['notes'] });
      router.back();
    },
  });

  const formAction = async (formData: FormData) => {
    const title = String(formData.get('title') ?? '').trim();
    const content = String(formData.get('content') ?? '').trim();
    const tag = String(formData.get('tag') ?? 'Todo') as NoteTag;

    if (title.length < 3 || title.length > 50) return;
    if (content.length > 500) return;

    await mutation.mutateAsync({ title, content, tag });
  };

  const handleChange = (e: React.ChangeEvent<HTMLFormElement>) => {
    const form = e.currentTarget;

    const title = (form.elements.namedItem('title') as HTMLInputElement | null)?.value ?? '';
    const content = (form.elements.namedItem('content') as HTMLTextAreaElement | null)?.value ?? '';
    const tag =
      ((form.elements.namedItem('tag') as HTMLSelectElement | null)?.value as NoteTag) ?? 'Todo';

    setDraft({ title, content, tag });
  };

  return (
    <form className={css.form} action={formAction} onChange={handleChange}>
      <div className={css.formGroup}>
        <label htmlFor="title">Title</label>
        <input
          id="title"
          type="text"
          name="title"
          className={css.input}
          defaultValue={draft?.title ?? initialDraft.title}
        />
        <span className={css.error}></span>
      </div>

      <div className={css.formGroup}>
        <label htmlFor="content">Content</label>
        <textarea
          id="content"
          name="content"
          rows={8}
          className={css.textarea}
          defaultValue={draft?.content ?? initialDraft.content}
        />
        <span className={css.error}></span>
      </div>

      <div className={css.formGroup}>
        <label htmlFor="tag">Tag</label>
        <select
          id="tag"
          name="tag"
          className={css.select}
          defaultValue={draft?.tag ?? initialDraft.tag}
        >
          {tags.map((tag) => (
            <option key={tag} value={tag}>
              {tag}
            </option>
          ))}
        </select>
        <span className={css.error}></span>
      </div>

      <div className={css.actions}>
        <button type="button" className={css.cancelButton} onClick={() => router.back()}>
          Cancel
        </button>

        <button type="submit" className={css.submitButton} disabled={mutation.isPending}>
          Create note
        </button>
      </div>
    </form>
  );
}
