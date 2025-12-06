'use client';

import { useState } from 'react';
import { UserButton } from '@clerk/nextjs';
import { Globe } from 'lucide-react';

import { UserPreferencesDialog } from './user-preferences-dialog';

export function CustomUserButton() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <UserButton>
        <UserButton.MenuItems>
          <UserButton.Action
            label="Update Locale & Currency"
            labelIcon={<Globe size={14} />}
            onClick={() => setIsOpen(true)}
          />
        </UserButton.MenuItems>
      </UserButton>

      <UserPreferencesDialog isOpen={isOpen} setIsOpen={setIsOpen} type="update" />
    </>
  );
}
