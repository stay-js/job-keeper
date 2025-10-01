'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
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
import { Input } from '~/components/ui/input';
import { Label } from '~/components/ui/label';
import { Button } from '~/components/ui/button';
import { DeletePopover } from './delete-popover';

export const formSchema = z.object({
  name: z.string().min(1, { message: 'Please specify a name!' }),
  wage: z.string().refine((value) => !isNaN(parseFloat(value.replace(',', '.'))), {
    message: 'Please specify valid wage!',
  }),
});

type FormSchema = z.infer<typeof formSchema>;

interface PositionWithCanDelete extends FormSchema {
  canDelete?: boolean;
}

export const PositionDialog: React.FC<{
  selected: number | null;
  setSelected: React.Dispatch<React.SetStateAction<number | null>>;
  getDefaultValues: (id: number | null) => PositionWithCanDelete;
}> = ({ selected, setSelected, getDefaultValues }) => {
  const router = useRouter();

  const [isOpen, setIsOpen] = useState(false);
  const [canDelete, setCanDelete] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormSchema>({ resolver: zodResolver(formSchema) });

  const { mutate: create } = api.position.create.useMutation({ onSuccess: () => router.refresh() });
  const { mutate: update } = api.position.update.useMutation({ onSuccess: () => router.refresh() });
  const { mutate: remove } = api.position.delete.useMutation({ onSuccess: () => router.refresh() });

  const onSubmit: SubmitHandler<FormSchema> = (data) => {
    const newData = {
      name: data.name,
      wage: parseFloat(data.wage.replace(',', '.')),
    };

    if (selected) update({ id: selected, ...newData });
    else create({ ...newData });

    setIsOpen(false);
    setSelected(null);
  };

  useEffect(() => {
    const defaultValues = getDefaultValues(selected);
    setCanDelete(defaultValues.canDelete ?? false);
    reset(defaultValues);

    if (selected) setIsOpen(true);
  }, [selected, reset, getDefaultValues]);

  return (
    <Dialog
      onOpenChange={(state) => {
        setIsOpen(state);
        if (!state) setSelected(null);
      }}
      open={isOpen}
    >
      <DialogTrigger asChild>
        <Button>Add new</Button>
      </DialogTrigger>

      <DialogContent className="w-11/12 max-w-lg rounded-lg">
        <DialogHeader>
          <DialogTitle>{selected ? 'Edit' : 'Add new'} position</DialogTitle>
          <DialogDescription>
            Use this form to {selected ? 'edit a' : 'add a new'} position. Once completed, click the
            &quot;Save changes&quot; button. You can only delete positions that have no hours worked
            logged.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4 gap-y-2">
              <Label htmlFor="name" className="text-right">
                Name
              </Label>
              <Input id="name" className="col-span-3" {...register('name')} />

              {errors.name && (
                <span className="col-span-full text-right text-xs text-red-500 dark:text-red-500">
                  {errors.name.message}
                </span>
              )}
            </div>
            <div className="grid grid-cols-4 items-center gap-4 gap-y-2">
              <Label htmlFor="wage" className="text-right">
                Hourly Wage
              </Label>
              <Input id="wage" className="col-span-3" {...register('wage')} />

              {errors.wage && (
                <span className="col-span-full text-right text-xs text-red-500 dark:text-red-500">
                  {errors.wage.message}
                </span>
              )}
            </div>
          </div>

          <DialogFooter className="flex gap-2">
            <Button type="submit">Save changes</Button>

            {canDelete && selected && (
              <DeletePopover
                type="position"
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
