'use client';

import { useRouter } from 'next/navigation';
import { z } from 'zod';
import { type SubmitHandler, Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { api } from '~/trpc/react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '~/components/ui/dialog';
import { Field, FieldError, FieldGroup, FieldLabel } from '~/components/ui/field';
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectGroup,
  SelectLabel,
  SelectItem,
} from '~/components/ui/select';
import { Button } from '~/components/ui/button';
import { useUserPreferences } from '~/contexts/user-preferences-context';
import { errorToast } from '~/lib/error-toast';
import { LOCALES, CURRENCIES } from '~/constants/locale-curreny';

export const formSchema = z.object({
  currency: z
    .string()
    .trim()
    .min(1, { error: 'Please select a currency!' })
    .max(16, { error: 'Currency is too long! (max 16 characters)' }),
  locale: z
    .string()
    .trim()
    .min(1, { error: 'Please select a locale!' })
    .max(16, { error: 'Locale is too long! (max 16 characters)' }),
  precision: z
    .string()
    .trim()
    .min(1, { error: 'Please select a precision!' })
    .max(2, { error: 'Precision is too long! (max 2 characters)' })
    .refine((val) => {
      const num = Number(val);

      return !isNaN(num) && num >= 0 && num <= 10 && Number.isInteger(num);
    }),
});

type FormSchema = z.infer<typeof formSchema>;

export function UserPreferencesDialog({
  isOpen,
  setIsOpen,
  type,
}: {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  type: 'initial' | 'update';
}) {
  const router = useRouter();

  const userPreferences = useUserPreferences();

  const { handleSubmit, control } = useForm<FormSchema>({
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
            <FieldGroup>
              <Controller
                name="locale"
                control={control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <div className="flex flex-wrap justify-between gap-x-4 gap-y-2">
                      <FieldLabel htmlFor="locale">
                        Locale: <span className="text-red-500">*</span>
                      </FieldLabel>
                      {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                    </div>

                    <Select
                      {...field}
                      onValueChange={field.onChange}
                      aria-invalid={fieldState.invalid}
                    >
                      <SelectTrigger id="locale" aria-invalid={fieldState.invalid}>
                        <SelectValue placeholder="Select locale" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectLabel>Locales</SelectLabel>
                          {LOCALES.map((locale) => (
                            <SelectItem key={locale} value={locale}>
                              {locale}
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </Field>
                )}
              />
            </FieldGroup>

            <FieldGroup>
              <Controller
                name="currency"
                control={control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <div className="flex flex-wrap justify-between gap-x-4 gap-y-2">
                      <FieldLabel htmlFor="currency">
                        Currency: <span className="text-red-500">*</span>
                      </FieldLabel>
                      {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                    </div>

                    <Select
                      {...field}
                      onValueChange={field.onChange}
                      aria-invalid={fieldState.invalid}
                    >
                      <SelectTrigger id="currency" aria-invalid={fieldState.invalid}>
                        <SelectValue placeholder="Select currency" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectLabel>Currencies</SelectLabel>

                          {CURRENCIES.map((currency) => (
                            <SelectItem key={currency} value={currency}>
                              {currency}
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </Field>
                )}
              />
            </FieldGroup>

            <FieldGroup>
              <Controller
                name="precision"
                control={control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <div className="flex flex-wrap justify-between gap-x-4 gap-y-2">
                      <FieldLabel htmlFor="precision">
                        Precision (Rounding): <span className="text-red-500">*</span>
                      </FieldLabel>
                      {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                    </div>

                    <Select
                      {...field}
                      onValueChange={field.onChange}
                      aria-invalid={fieldState.invalid}
                    >
                      <SelectTrigger id="precision" aria-invalid={fieldState.invalid}>
                        <SelectValue placeholder="Select precision" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectLabel>Precisions</SelectLabel>

                          {['0', '1', '2'].map((precision) => (
                            <SelectItem key={precision} value={precision}>
                              {precision}
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </Field>
                )}
              />
            </FieldGroup>
          </div>

          <DialogFooter>
            <Button type="submit">Save changes</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
