'use client';

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
import { z } from 'zod';
import { SubmitHandler, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { api } from '~/trpc/react';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { createDateOnlyString } from '~/utils/create-date-only-string';
import { errorToast } from '~/utils/error-toast';
import { Label } from './ui/label';
import { Input } from './ui/input';

export const formSchema = z.object({
  name: z.string().min(1, { message: 'Please specify a name!' }),
  amount: z.string().refine(
    (value) => {
      const num = parseFloat(value.replace(',', '.'));
      return num > 0;
    },
    {
      message: 'Please specify valid amount! (>0)',
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
  const [isOpen, setIsOpen] = useState(false);

  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = useForm<FormSchema>({ resolver: zodResolver(formSchema) });

  register('date');
  setValue('date', date);

  const { mutate: create } = api.expense.create.useMutation({
    onSuccess: () => router.refresh(),
    onError: () => errorToast(),
  });
  const { mutate: update } = api.expense.update.useMutation({
    onSuccess: () => router.refresh(),
    onError: () => errorToast(),
  });
  const { mutate: remove } = api.expense.delete.useMutation({
    onSuccess: () => router.refresh(),
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
    reset(defaultValues);

    if (selected) setIsOpen(true);
  }, [selected, reset, getDefaultValues]);

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
            <div className="grid grid-cols-4 items-center gap-4 gap-y-2">
              <Label htmlFor="name" className="text-right">
                Name:
              </Label>
              <Input id="name" className="col-span-3" {...register('name')} />

              {errors.name && (
                <span className="col-span-full text-right text-xs text-red-500 dark:text-red-500">
                  {errors.name.message}
                </span>
              )}
            </div>
            <div className="grid grid-cols-4 items-center gap-4 gap-y-2">
              <Label htmlFor="amount" className="text-right">
                Amount:
              </Label>
              <Input id="amount" className="col-span-3" {...register('amount')} />

              {errors.amount && (
                <span className="col-span-full text-right text-xs text-red-500 dark:text-red-500">
                  {errors.amount.message}
                </span>
              )}
            </div>
          </div>

          <DialogFooter className="flex gap-2">
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
