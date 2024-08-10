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
import { Input } from '~/components/ui/input';
import { Label } from '~/components/ui/label';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { api } from '~/trpc/react';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { currencyFormatter } from '~/utils/currency-formatter';

export const formSchema = z.object({
  date: z.string().refine((value) => !isNaN(new Date(value).getTime()), {
    message: 'Please specify a valid date!',
  }),
  location: z.string().min(1, { message: 'Please specify a location!' }),
  event: z.string().min(1, { message: 'Please specify an event!' }),
  wageId: z
    .string()
    .refine((value) => parseInt(value) > 0, { message: 'Please select a position!' }),
  hours: z
    .string()
    .refine((value) => parseFloat(value) > 0, { message: 'Please specify valid hours!' }),
});

export const JobDialog: React.FC<{ positions: RouterOutputs['position']['getAll'] }> = ({
  positions,
}) => {
  const router = useRouter();

  const [isOpen, setIsOpen] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<{ date: string; location: string; event: string; wageId: string; hours: string }>({
    resolver: zodResolver(formSchema),
  });

  const { mutate } = api.job.create.useMutation({
    onSuccess: () => {
      router.refresh();
      setIsOpen(false);
    },
  });

  useEffect(() => reset(), [isOpen, reset]);

  return (
    <Dialog onOpenChange={setIsOpen} open={isOpen}>
      <DialogTrigger asChild>
        <Button>Add new</Button>
      </DialogTrigger>

      <DialogContent className="w-11/12 max-w-lg rounded-lg">
        <DialogHeader>
          <DialogTitle>Add new job</DialogTitle>
          <DialogDescription>
            Use this form to add a new job. Once completed, click the &quot;Save changes&quot;
            button to add the job to the database.
          </DialogDescription>
        </DialogHeader>

        <form
          onSubmit={handleSubmit((data) =>
            mutate({
              ...data,
              date: new Date(data.date),
              hours: parseFloat(data.hours),
              wageId: parseInt(data.wageId),
            }),
          )}
        >
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

              <select
                id="position"
                {...register('wageId')}
                className="col-span-3 flex h-10 w-full items-center justify-between rounded-md border border-neutral-200 bg-white p-2 text-sm ring-offset-white placeholder:text-neutral-500 focus:outline-none focus:ring-2 focus:ring-neutral-950 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:border-neutral-800 dark:bg-neutral-950 dark:ring-offset-neutral-950 dark:placeholder:text-neutral-400 dark:focus:ring-neutral-300 [&>span]:line-clamp-1"
              >
                <option>Select a position</option>

                {positions.map((position) => (
                  <option key={position.id} value={position.id}>
                    {position.name} ({currencyFormatter.format(position.wage)})
                  </option>
                ))}
              </select>

              {errors.wageId && (
                <span className="col-span-full text-right text-xs text-red-500 dark:text-red-500">
                  {errors.wageId.message}
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

          <DialogFooter>
            <Button type="submit">Save changes</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
