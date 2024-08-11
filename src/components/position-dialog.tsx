'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
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
import { Popover, PopoverContent, PopoverTrigger } from '~/components/ui/popover';
import { Input } from '~/components/ui/input';
import { Label } from '~/components/ui/label';
import { Button } from './ui/button';

export const formSchema = z.object({
  name: z.string().min(1, { message: 'Please specify a name!' }),
  wage: z
    .string()
    .min(1, { message: 'Please specify a wage!' })
    .refine((wage) => !isNaN(parseInt(wage)), { message: 'Please specify a valid wage!' }),
});

type FormSchema = z.infer<typeof formSchema>;

export const PositionDialog: React.FC<{
  selected: number | null;
  setSelected: React.Dispatch<React.SetStateAction<number | null>>;
  getDefaultValues: (id: number | null) => FormSchema;
}> = ({ selected, setSelected, getDefaultValues }) => {
  const router = useRouter();

  const [isOpen, setIsOpen] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormSchema>({ resolver: zodResolver(formSchema) });

  const { mutate: create } = api.position.create.useMutation({ onSuccess: () => router.refresh() });
  const { mutate: update } = api.position.update.useMutation({ onSuccess: () => router.refresh() });
  const { mutate: remove } = api.position.delete.useMutation({ onSuccess: () => router.refresh() });

  const onSubmit = (data: FormSchema) => {
    if (selected) update({ id: selected, ...data, wage: parseInt(data.wage) });
    else create({ ...data, wage: parseInt(data.wage) });
    setIsOpen(false);
    setSelected(null);
  };

  useEffect(() => {
    reset(getDefaultValues(selected));
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
            &quot;Save changes&quot; button.
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
              <Input id="wage" className="col-span-3" type="number" {...register('wage')} />

              {errors.wage && (
                <span className="col-span-full text-right text-xs text-red-500 dark:text-red-500">
                  {errors.wage.message}
                </span>
              )}
            </div>
          </div>

          <DialogFooter>
            <Button type="submit">Save changes</Button>
            {selected && (
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="destructive" type="button">
                    Delete
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="flex flex-col gap-6">
                  <div className="flex flex-col gap-1.5">
                    <p className="font-medium leading-none">Delete position</p>
                    <p className="text-sm text-neutral-400">
                      Are you sure you want to delete this position? This action is{' '}
                      <b>permanent and irreversible</b>.
                    </p>
                  </div>

                  <Button
                    variant="destructive"
                    type="button"
                    onClick={() => {
                      remove({ id: selected });
                      setSelected(null);
                      setIsOpen(false);
                    }}
                  >
                    Delete position
                  </Button>
                </PopoverContent>
              </Popover>
            )}
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
