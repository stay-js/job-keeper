'use client';

import { useState, useEffect } from 'react';
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
  DialogTrigger,
} from '~/components/ui/dialog';
import { DeletePopover } from '~/components/delete-popover';
import { Button } from '~/components/ui/button';
import { Field, FieldError, FieldGroup, FieldLabel } from '~/components/ui/field';
import { Input } from '~/components/ui/input';
import { createDateOnlyString } from '~/lib/create-date-only-string';
import { errorToast } from '~/lib/error-toast';

export const formSchema = z.object({
  name: z
    .string()
    .min(1, { error: 'Please specify a name!' })
    .max(256, { error: 'Name is too long! (max 256 characters)' }),
  amount: z.string().refine(
    (value) => {
      const num = parseFloat(value.replace(',', '.'));
      return num > 0;
    },
    {
      error: 'Please specify valid amount! (>0)',
    },
  ),
  date: z.date(),
});

type FormSchema = z.infer<typeof formSchema>;

export const ExpensesDialog: React.FC<{
  selected: number | null;
  setSelected: React.Dispatch<React.SetStateAction<number | null>>;
  getDefaultValues: (id: number | null) => Omit<FormSchema, 'date'>;
  date: Date;
}> = ({ selected, setSelected, getDefaultValues, date }) => {
  const utils = api.useUtils();

  const [isOpen, setIsOpen] = useState(false);

  const { handleSubmit, reset, control } = useForm<FormSchema>({
    resolver: zodResolver(formSchema),
  });

  const { mutate: create } = api.expenses.create.useMutation({
    onSuccess: () => utils.expenses.invalidate(),
    onError: () => errorToast(),
  });

  const { mutate: update } = api.expenses.update.useMutation({
    onSuccess: () => utils.expenses.invalidate(),
    onError: () => errorToast(),
  });

  const { mutate: remove } = api.expenses.delete.useMutation({
    onSuccess: () => utils.expenses.invalidate(),
    onError: () => errorToast(),
  });

  const onSubmit: SubmitHandler<FormSchema> = (data) => {
    const newData = {
      ...data,
      date: createDateOnlyString(data.date),
      amount: parseFloat(data.amount.replace(',', '.')),
    };

    if (selected) update({ id: selected, ...newData });
    else create(newData);

    setIsOpen(false);
    setSelected(null);
  };

  useEffect(() => {
    const defaultValues = getDefaultValues(selected);
    reset({ ...defaultValues, date });

    if (selected) setIsOpen(true);
  }, [selected, reset, getDefaultValues, date]);

  return (
    <Dialog
      onOpenChange={(state) => {
        setIsOpen(state);

        if (!state) {
          setSelected(null);
          reset();
        }
      }}
      open={isOpen}
    >
      <DialogTrigger asChild>
        <Button>Add expense</Button>
      </DialogTrigger>

      <DialogContent className="w-11/12 max-w-lg rounded-lg">
        <DialogHeader>
          <DialogTitle>{selected ? 'Edit' : 'Add new'} expense</DialogTitle>

          <DialogDescription>
            Use this form to {selected ? 'edit an' : 'add a new'} expense. Once completed, click the
            &quot;Save changes&quot; button.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="grid gap-4 py-4">
            <FieldGroup>
              <Controller
                name="name"
                control={control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <div className="flex flex-wrap justify-between gap-x-4 gap-y-2">
                      <FieldLabel htmlFor="name">
                        Name: <span className="text-red-500">*</span>
                      </FieldLabel>
                      {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                    </div>

                    <Input
                      {...field}
                      id="name"
                      type="text"
                      placeholder="Name"
                      className="bg-background border-border text-foreground"
                      aria-invalid={fieldState.invalid}
                    />
                  </Field>
                )}
              />
            </FieldGroup>

            <FieldGroup>
              <Controller
                name="amount"
                control={control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <div className="flex flex-wrap justify-between gap-x-4 gap-y-2">
                      <FieldLabel htmlFor="amount">
                        Amount: <span className="text-red-500">*</span>
                      </FieldLabel>
                      {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                    </div>

                    <Input
                      {...field}
                      id="amount"
                      type="text"
                      placeholder="Amount"
                      className="bg-background border-border text-foreground"
                      aria-invalid={fieldState.invalid}
                    />
                  </Field>
                )}
              />
            </FieldGroup>
          </div>

          <DialogFooter>
            <Button type="submit">Save changes</Button>

            {selected && (
              <DeletePopover
                type="expense"
                onDelete={() => {
                  remove({ id: selected });

                  setSelected(null);
                  setIsOpen(false);
                }}
              />
            )}
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
