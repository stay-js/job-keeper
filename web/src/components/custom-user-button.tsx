'use client';

import { useState } from 'react';
import { UserButton } from '@clerk/nextjs';
import { Globe } from 'lucide-react';
import { LocaleCurrencyDialog } from './locale-currency-dialog';

export const CustomUserButton = () => {
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

      <LocaleCurrencyDialog isOpen={isOpen} setIsOpen={setIsOpen} />
    </>
  );
};