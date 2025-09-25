'use client';

import { UserButton } from '@clerk/nextjs';
import { Globe } from 'lucide-react';

export const CustomUserButton = () => (
  <UserButton>
    <UserButton.MenuItems>
      <UserButton.Action
        label="Update Locale & Currency"
        labelIcon={<Globe size={14} />}
        onClick={() => alert('TODO')}
      />
    </UserButton.MenuItems>
  </UserButton>
);