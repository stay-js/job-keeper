'use client';

import { useRouter } from 'next/navigation';
import { z } from 'zod';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ChevronsUpDown } from 'lucide-react';
import locale from 'locale-codes';

import { api } from '~/trpc/react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '~/components/ui/dialog';
import { Label } from '~/components/ui/label';
import { Button } from '~/components/ui/button';
import { useUserPreferences } from '~/contexts/user-preferences-context';
import { errorToast } from '~/lib/error-toast';

export const formSchema = z.object({
  currency: z
    .string()
    .min(1, { error: 'Please select a currency!' })
    .max(16, { error: 'Currency is too long! (max 16 characters)' }),
  locale: z
    .string()
    .min(1, { error: 'Please select a locale!' })
    .max(16, { error: 'Locale is too long! (max 16 characters)' }),
  precision: z
    .string()
    .min(1, { error: 'Please select a precision!' })
    .max(2, { error: 'Precision is too long! (max 2 characters)' })
    .refine((val) => {
      const num = Number(val);

      return !isNaN(num) && num >= 0 && num <= 10 && Number.isInteger(num);
    }),
});

type FormSchema = z.infer<typeof formSchema>;

export const UserPreferencesDialog: React.FC<{
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  type: 'initial' | 'update';
}> = ({ isOpen, setIsOpen, type }) => {
  const router = useRouter();

  const userPreferences = useUserPreferences();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormSchema>({
    resolver: zodResolver(formSchema),
    defaultValues: { ...userPreferences, precision: String(userPreferences.precision) },
  });

  const { mutate } = api.userPreferences.upsert.useMutation({
    onSuccess: () => router.refresh(),
    onError: () => errorToast(),
  });

  const onSubmit: SubmitHandler<FormSchema> = (data) => {
    mutate({ ...data, precision: Number(data.precision) });
    setIsOpen(false);
  };

  return (
    <Dialog onOpenChange={setIsOpen} open={isOpen}>
      <DialogContent className="w-11/12 max-w-lg rounded-lg">
        <DialogHeader>
          <DialogTitle>{type === 'initial' ? 'Set' : 'Update'} Locale & Currency</DialogTitle>
          <DialogDescription>
            {type === 'initial'
              ? 'Please select your preferred locale and currency.'
              : 'Use this form to update the locale and currency settings.'}{' '}
            Once completed, click the &quot;Save changes&quot; button.
            {type === 'initial' &&
              ' This dialog will open every time you log in until you save your preferences. You can change these settings later in your profile.'}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4 gap-y-2">
              <Label htmlFor="locale" className="text-right">
                Locale: <span className="text-red-500">*</span>
              </Label>

              <div className="relative col-span-3">
                <select
                  id="date-format"
                  {...register('locale')}
                  className="flex h-10 w-full cursor-pointer appearance-none items-center justify-between rounded-md border border-neutral-200 bg-white p-2 text-sm ring-offset-white placeholder:text-neutral-500 focus:ring-2 focus:ring-neutral-950 focus:ring-offset-2 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50 dark:border-neutral-800 dark:bg-neutral-950 dark:ring-offset-neutral-950 dark:placeholder:text-neutral-400 dark:focus:ring-neutral-300 [&>span]:line-clamp-1"
                >
                  <option value="">Select locale</option>

                  {locale.all.map((format) => (
                    <option key={format.tag} value={format.tag}>
                      {format.name} ({format.tag})
                    </option>
                  ))}
                </select>

                <ChevronsUpDown
                  size={14}
                  className="pointer-events-none absolute top-1/2 right-2 -translate-y-1/2 text-neutral-500"
                />
              </div>

              {errors.locale && (
                <span className="col-span-full text-right text-xs text-red-500 dark:text-red-500">
                  {errors.locale.message}
                </span>
              )}
            </div>

            <div className="grid grid-cols-4 items-center gap-4 gap-y-2">
              <Label htmlFor="currency" className="text-right">
                Currency: <span className="text-red-500">*</span>
              </Label>

              <div className="relative col-span-3">
                <select
                  id="currency"
                  {...register('currency')}
                  className="flex h-10 w-full cursor-pointer appearance-none items-center justify-between rounded-md border border-neutral-200 bg-white p-2 text-sm ring-offset-white placeholder:text-neutral-500 focus:ring-2 focus:ring-neutral-950 focus:ring-offset-2 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50 dark:border-neutral-800 dark:bg-neutral-950 dark:ring-offset-neutral-950 dark:placeholder:text-neutral-400 dark:focus:ring-neutral-300 [&>span]:line-clamp-1"
                >
                  <option value="">Select currency</option>

                  {Intl.supportedValuesOf('currency').map((currency) => (
                    <option key={currency} value={currency}>
                      {currency}
                    </option>
                  ))}
                </select>

                <ChevronsUpDown
                  size={14}
                  className="pointer-events-none absolute top-1/2 right-2 -translate-y-1/2 text-neutral-500"
                />
              </div>

              {errors.currency && (
                <span className="col-span-full text-right text-xs text-red-500 dark:text-red-500">
                  {errors.currency.message}
                </span>
              )}
            </div>

            <div className="grid grid-cols-4 items-center gap-4 gap-y-2">
              <Label htmlFor="precision" className="text-right">
                Precision (Rounding): <span className="text-red-500">*</span>
              </Label>

              <div className="relative col-span-3">
                <select
                  id="precision"
                  {...register('precision')}
                  className="flex h-10 w-full cursor-pointer appearance-none items-center justify-between rounded-md border border-neutral-200 bg-white p-2 text-sm ring-offset-white placeholder:text-neutral-500 focus:ring-2 focus:ring-neutral-950 focus:ring-offset-2 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50 dark:border-neutral-800 dark:bg-neutral-950 dark:ring-offset-neutral-950 dark:placeholder:text-neutral-400 dark:focus:ring-neutral-300 [&>span]:line-clamp-1"
                >
                  <option value="">Select precision</option>

                  {[0, 1, 2].map((precision) => (
                    <option key={precision} value={precision}>
                      {precision}
                    </option>
                  ))}
                </select>

                <ChevronsUpDown
                  size={14}
                  className="pointer-events-none absolute top-1/2 right-2 -translate-y-1/2 text-neutral-500"
                />
              </div>

              {errors.precision && (
                <span className="col-span-full text-right text-xs text-red-500 dark:text-red-500">
                  {errors.precision.message}
                </span>
              )}
            </div>
          </div>

          <DialogFooter>
            <Button type="submit">Save changes</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
