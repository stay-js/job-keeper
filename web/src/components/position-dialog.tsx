'use client';

import { useState, useEffect } from 'react';
import { api } from '~/trpc/react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
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
import { errorToast } from '~/utils/error-toast';

export const formSchema = z.object({
  name: z
    .string()
    .min(1, { error: 'Please specify a name!' })
    .max(256, { error: 'Name is too long! (max 256 characters)' }),
  wage: z.string().refine(
    (value) => {
      const num = parseFloat(value.replace(',', '.'));
      return num > 0;
    },
    {
      error: 'Please specify valid wage! (>0)',
    },
  ),
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
  const utils = api.useUtils();

  const [isOpen, setIsOpen] = useState(false);
  const [canDelete, setCanDelete] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormSchema>({ resolver: zodResolver(formSchema) });

  const { mutate: create } = api.positions.create.useMutation({
    onSuccess: () => utils.positions.invalidate(),
    onError: () => errorToast(),
  });

  const { mutate: update } = api.positions.update.useMutation({
    onSuccess: () => utils.positions.invalidate(),
    onError: () => errorToast(),
  });

  const { mutate: remove } = api.positions.delete.useMutation({
    onSuccess: () => utils.positions.invalidate(),
    onError: () => errorToast(),
  });

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
                Name: <span className="text-red-500">*</span>
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
                Hourly Wage: <span className="text-red-500">*</span>
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
