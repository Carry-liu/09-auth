'use client';

import Image from 'next/image';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

import css from './EditProfilePage.module.css';
import type { User } from '@/types/user';
import { getMe, updateMe } from '@/lib/api/clientApi';
import { useAuthStore } from '@/lib/store/authStore';

export default function EditProfilePage() {
  const router = useRouter();
  const setUser = useAuthStore((state) => state.setUser);

  const [user, setLocalUser] = useState<User | null>(null);
  const [username, setUsername] = useState('');

  useEffect(() => {
    const loadUser = async () => {
      const currentUser = await getMe();
      setLocalUser(currentUser);
      setUsername(currentUser.username);
    };

    loadUser();
  }, []);

  const handleSubmit = async (formData: FormData) => {
    const nextUsername = String(formData.get('username') ?? '');
    const updatedUser = await updateMe({ username: nextUsername });

    // ✅ оновлюємо глобальний auth store
    setUser(updatedUser);

    router.push('/profile');
  };

  if (!user) {
    return null;
  }

  return (
    <main className={css.mainContent}>
      <div className={css.profileCard}>
        <h1 className={css.formTitle}>Edit Profile</h1>

        <Image
          src={user.avatar}
          alt="User Avatar"
          width={120}
          height={120}
          className={css.avatar}
        />

        <form className={css.profileInfo} action={handleSubmit}>
          <div className={css.usernameWrapper}>
            <label htmlFor="username">Username:</label>
            <input
              id="username"
              name="username"
              type="text"
              className={css.input}
              value={username}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setUsername(e.target.value)}
            />
          </div>

          <p>Email: {user.email}</p>

          <div className={css.actions}>
            <button type="submit" className={css.saveButton}>
              Save
            </button>
            <button
              type="button"
              className={css.cancelButton}
              onClick={() => router.push('/profile')}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}
