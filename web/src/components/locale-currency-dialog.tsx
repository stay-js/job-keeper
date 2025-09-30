'use client';

import { useRouter } from 'next/navigation';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { ChevronsUpDown } from 'lucide-react';
import locale from 'locale-codes';
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
import { api } from '~/trpc/react';
import { useUserData } from '~/contexts/user-data-context';

export const formSchema = z.object({
  currency: z.string().min(1, { message: 'Please select a currency!' }).max(16),
  locale: z.string().min(1, { message: 'Please select a locale!' }).max(16),
  precision: z
    .string()
    .min(1, { message: 'Please select a precision!' })
    .max(2)
    .refine((val) => {
      const num = Number(val);

      return !isNaN(num) && num >= 0 && num <= 10 && Number.isInteger(num);
    }),
});

type FormSchema = z.infer<typeof formSchema>;

export const LocaleCurrencyDialog: React.FC<{
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}> = ({ isOpen, setIsOpen }) => {
  const router = useRouter();

  const userData = useUserData();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormSchema>({
    resolver: zodResolver(formSchema),
    defaultValues: { ...userData, precision: String(userData.precision) },
  });

  const { mutate } = api.userData.upsertUserData.useMutation({ onSuccess: () => router.refresh() });

  const onSubmit: SubmitHandler<FormSchema> = (data) => {
    mutate({ ...data, precision: Number(data.precision) });
    setIsOpen(false);
  };

  return (
    <Dialog onOpenChange={setIsOpen} open={isOpen}>
      <DialogContent className="w-11/12 max-w-lg rounded-lg">
        <DialogHeader>
          <DialogTitle>Update Locale & Currency</DialogTitle>
          <DialogDescription>
            Use this form to update the locale and currency settings. Once completed, click the
            &quot;Save changes&quot; button.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4 gap-y-2">
              <Label htmlFor="locale" className="text-right">
                Locale
              </Label>

              <div className="relative col-span-3">
                <select
                  id="date-format"
                  {...register('locale')}
                  className="flex h-10 w-full appearance-none items-center justify-between rounded-md border border-neutral-200 bg-white p-2 text-sm ring-offset-white placeholder:text-neutral-500 focus:ring-2 focus:ring-neutral-950 focus:ring-offset-2 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50 dark:border-neutral-800 dark:bg-neutral-950 dark:ring-offset-neutral-950 dark:placeholder:text-neutral-400 dark:focus:ring-neutral-300 [&>span]:line-clamp-1"
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
                Currency
              </Label>

              <div className="relative col-span-3">
                <select
                  id="currency"
                  {...register('currency')}
                  className="flex h-10 w-full appearance-none items-center justify-between rounded-md border border-neutral-200 bg-white p-2 text-sm ring-offset-white placeholder:text-neutral-500 focus:ring-2 focus:ring-neutral-950 focus:ring-offset-2 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50 dark:border-neutral-800 dark:bg-neutral-950 dark:ring-offset-neutral-950 dark:placeholder:text-neutral-400 dark:focus:ring-neutral-300 [&>span]:line-clamp-1"
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
                Precision (Rounding)
              </Label>

              <div className="relative col-span-3">
                <select
                  id="precision"
                  {...register('precision')}
                  className="flex h-10 w-full appearance-none items-center justify-between rounded-md border border-neutral-200 bg-white p-2 text-sm ring-offset-white placeholder:text-neutral-500 focus:ring-2 focus:ring-neutral-950 focus:ring-offset-2 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50 dark:border-neutral-800 dark:bg-neutral-950 dark:ring-offset-neutral-950 dark:placeholder:text-neutral-400 dark:focus:ring-neutral-300 [&>span]:line-clamp-1"
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

          <DialogFooter className="flex gap-2">
            <Button type="submit">Save changes</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
