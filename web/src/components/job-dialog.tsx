'use client';

import type { RouterOutputs } from '~/trpc/react';
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
import { DeletePopover } from '~/components/delete-popover';
import { z } from 'zod';
import { SubmitHandler, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { api } from '~/trpc/react';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { currencyFormatter } from '~/utils/currency-formatter';
import { ChevronsUpDown } from 'lucide-react';

export const formSchema = z.object({
  date: z.string().refine((value) => !isNaN(new Date(value).getTime()), {
    message: 'Please specify a valid date!',
  }),
  location: z.string().min(1, { message: 'Please specify a location!' }),
  event: z.string().min(1, { message: 'Please specify an event!' }),
  positionId: z.string().refine((value) => value !== 'default' && parseInt(value) > 0, {
    message: 'Please select a position!',
  }),
  hours: z.string().refine((value) => parseFloat(value.replace(',', '.')) > 0, {
    message: 'Please specify valid hours!',
  }),
});

type FormSchema = z.infer<typeof formSchema>;

export const JobDialog: React.FC<{
  positions: RouterOutputs['position']['getAll'];
  selected: number | null;
  setSelected: React.Dispatch<React.SetStateAction<number | null>>;
  getDefaultValues: (id: number | null) => FormSchema;
}> = ({ positions, selected, setSelected, getDefaultValues }) => {
  const [isOpen, setIsOpen] = useState(false);

  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<{
    date: string;
    location: string;
    event: string;
    positionId: string;
    hours: string;
  }>({ resolver: zodResolver(formSchema) });

  const { mutate: create } = api.job.create.useMutation({ onSuccess: () => router.refresh() });
  const { mutate: update } = api.job.update.useMutation({ onSuccess: () => router.refresh() });
  const { mutate: remove } = api.job.delete.useMutation({ onSuccess: () => router.refresh() });

  const onSubmit: SubmitHandler<FormSchema> = (data) => {
    const newData = {
      ...data,
      date: new Date(data.date),
      hours: parseFloat(data.hours.replace(',', '.')),
      positionId: parseInt(data.positionId),
    };

    if (selected) update({ id: selected, ...newData });
    else create(newData);

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
          <DialogTitle>{selected ? 'Edit' : 'Add new'} job</DialogTitle>
          <DialogDescription>
            Use this form to {selected ? 'edit a' : 'add a new'} job. Once completed, click the
            &quot;Save changes&quot; button.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4 gap-y-2">
              <Label htmlFor="date" className="text-right">
                Date
              </Label>
              <Input id="date" className="col-span-3" {...register('date')} />

              {errors.date && (
                <span className="col-span-full text-right text-xs text-red-500 dark:text-red-500">
                  {errors.date.message}
                </span>
              )}
            </div>

            <div className="grid grid-cols-4 items-center gap-4 gap-y-2">
              <Label htmlFor="location" className="text-right">
                Location
              </Label>
              <Input id="location" className="col-span-3" {...register('location')} />

              {errors.location && (
                <span className="col-span-full text-right text-xs text-red-500 dark:text-red-500">
                  {errors.location.message}
                </span>
              )}
            </div>

            <div className="grid grid-cols-4 items-center gap-4 gap-y-2">
              <Label htmlFor="event" className="text-right">
                Event
              </Label>
              <Input id="event" className="col-span-3" {...register('event')} />

              {errors.event && (
                <span className="col-span-full text-right text-xs text-red-500 dark:text-red-500">
                  {errors.event.message}
                </span>
              )}
            </div>

            <div className="grid grid-cols-4 items-center gap-4 gap-y-2">
              <Label htmlFor="position" className="text-right">
                Position
              </Label>

              <div className="relative col-span-3">
                <select
                  id="position"
                  {...register('positionId')}
                  className="flex h-10 w-full appearance-none items-center justify-between rounded-md border border-neutral-200 bg-white p-2 text-sm ring-offset-white placeholder:text-neutral-500 focus:ring-2 focus:ring-neutral-950 focus:ring-offset-2 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50 dark:border-neutral-800 dark:bg-neutral-950 dark:ring-offset-neutral-950 dark:placeholder:text-neutral-400 dark:focus:ring-neutral-300 [&>span]:line-clamp-1"
                >
                  <option value="default">Select position</option>

                  {positions.map((position) => (
                    <option key={position.id} value={position.id}>
                      {position.name} ({currencyFormatter.format(position.wage)})
                    </option>
                  ))}
                </select>

                <ChevronsUpDown
                  size={14}
                  className="pointer-events-none absolute top-1/2 right-2 -translate-y-1/2 text-neutral-500"
                />
              </div>

              {errors.positionId && (
                <span className="col-span-full text-right text-xs text-red-500 dark:text-red-500">
                  {errors.positionId.message}
                </span>
              )}
            </div>

            <div className="grid grid-cols-4 items-center gap-4 gap-y-2">
              <Label htmlFor="hours" className="text-right">
                Hours
              </Label>
              <Input id="hours" className="col-span-3" {...register('hours')} />

              {errors.hours && (
                <span className="col-span-full text-right text-xs text-red-500 dark:text-red-500">
                  {errors.hours.message}
                </span>
              )}
            </div>
          </div>

          <DialogFooter className="flex gap-2">
            <Button type="submit">Save changes</Button>

            {selected && (
              <DeletePopover
                type="job"
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
