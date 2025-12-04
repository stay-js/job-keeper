'use client';

import { useState, useEffect } from 'react';
import { api, type RouterOutputs } from '~/trpc/react';
import type { Optional } from 'utility-types';
import { z } from 'zod';
import { type SubmitHandler, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ChevronsUpDown } from 'lucide-react';
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
import { DatePicker } from '~/components/ui/date-picker';
import { DeletePopover } from '~/components/delete-popover';
import { Button } from '~/components/ui/button';
import { useUserPreferences } from '~/contexts/user-preferences-context';
import { getFormatters } from '~/utils/formatters';
import { createDateOnlyString } from '~/utils/create-date-only-string';
import { errorToast } from '~/utils/error-toast';

export const formSchema = z.object({
  date: z.date({ error: 'Please select a valid date!' }),
  location: z
    .string()
    .min(1, { error: 'Please specify a location!' })
    .max(256, { error: 'Location is too long! (max 256 characters)' }),
  event: z.string().max(256, { error: 'Event is too long! (max 256 characters)' }).optional(),
  positionId: z.string().refine((value) => value !== 'default' && parseInt(value) > 0, {
    error: 'Please select a position!',
  }),
  hours: z.string().refine(
    (value) => {
      const num = parseFloat(value.replace(',', '.'));
      return num > 0 && num <= 24;
    },
    {
      error: 'Please specify valid work hours! (0-24)',
    },
  ),
});

type FormSchema = z.infer<typeof formSchema>;

export const JobDialog: React.FC<{
  positions: RouterOutputs['position']['getAll'] | undefined;
  selected: number | null;
  setSelected: React.Dispatch<React.SetStateAction<number | null>>;
  getDefaultValues: (id: number | null) => Optional<FormSchema, 'date'>;
  defaultMonth: Date;
}> = ({ positions = [], selected, setSelected, getDefaultValues, defaultMonth }) => {
  const utils = api.useUtils();

  const userPreferences = useUserPreferences();
  const { currency: cf } = getFormatters(userPreferences);

  const [isOpen, setIsOpen] = useState(false);
  const [date, setDate] = useState<Date | undefined>();

  const canCreate = positions.length > 0;

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = useForm<FormSchema>({ resolver: zodResolver(formSchema) });

  register('date');
  useEffect(() => setValue('date', date ?? new Date()), [date, setValue]);

  const { mutate: create } = api.job.create.useMutation({
    onSuccess: () => utils.job.invalidate(),
    onError: () => errorToast(),
  });

  const { mutate: update } = api.job.update.useMutation({
    onSuccess: () => utils.job.invalidate(),
    onError: () => errorToast(),
  });

  const { mutate: remove } = api.job.delete.useMutation({
    onSuccess: () => utils.job.invalidate(),
    onError: () => errorToast(),
  });

  const onSubmit: SubmitHandler<FormSchema> = (data) => {
    const newData = {
      ...data,
      date: createDateOnlyString(data.date),
      hours: parseFloat(data.hours.replace(',', '.')),
      positionId: parseInt(data.positionId),
    };

    if (selected) update({ id: selected, ...newData });
    else create(newData);

    setIsOpen(false);
    setSelected(null);
  };

  useEffect(() => {
    const defaultValues = getDefaultValues(selected);
    setDate(defaultValues.date);
    reset(defaultValues);

    if (selected) setIsOpen(true);
  }, [selected, reset, getDefaultValues, setDate]);

  return (
    <Dialog
      onOpenChange={(state) => {
        setIsOpen(state);

        if (!state) {
          setSelected(null);
          setDate(undefined);
          reset();
        }
      }}
      open={isOpen}
    >
      <DialogTrigger asChild>
        <Button>Add new</Button>
      </DialogTrigger>

      <DialogContent className="w-11/12 max-w-lg rounded-lg">
        <DialogHeader>
          <DialogTitle>{selected ? 'Edit' : 'Add new'} job</DialogTitle>
          {canCreate ? (
            <DialogDescription>
              Use this form to {selected ? 'edit a' : 'add a new'} job. Once completed, click the
              &quot;Save changes&quot; button.
            </DialogDescription>
          ) : (
            <DialogDescription className="text-base">
              In order to add jobs, you need to create at least one position first!
            </DialogDescription>
          )}
        </DialogHeader>

        {canCreate && (
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4 gap-y-2">
                <Label htmlFor="date" className="text-right">
                  Date: <span className="text-red-500">*</span>
                </Label>

                <DatePicker
                  className="col-span-3"
                  date={date}
                  setDate={setDate}
                  locale={userPreferences.locale}
                  defaultMonth={defaultMonth}
                />

                {errors.date && (
                  <span className="col-span-full text-right text-xs text-red-500 dark:text-red-500">
                    {errors.date.message}
                  </span>
                )}
              </div>

              <div className="grid grid-cols-4 items-center gap-4 gap-y-2">
                <Label htmlFor="location" className="text-right">
                  Location: <span className="text-red-500">*</span>
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
                  Event:
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
                  Position: <span className="text-red-500">*</span>
                </Label>

                <div className="relative col-span-3">
                  <select
                    id="position"
                    {...register('positionId')}
                    className="flex h-10 w-full cursor-pointer appearance-none items-center justify-between rounded-md border border-neutral-200 bg-white p-2 text-sm ring-offset-white placeholder:text-neutral-500 focus:outline-none focus:ring-2 focus:ring-neutral-950 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:border-neutral-800 dark:bg-neutral-950 dark:ring-offset-neutral-950 dark:placeholder:text-neutral-400 dark:focus:ring-neutral-300 [&>span]:line-clamp-1"
                  >
                    <option value="default">Select position</option>

                    {positions.map((position) => (
                      <option key={position.id} value={position.id}>
                        {position.name} ({cf.format(position.wage)})
                      </option>
                    ))}
                  </select>

                  <ChevronsUpDown
                    size={14}
                    className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-neutral-500"
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
                  Hours: <span className="text-red-500">*</span>
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
        )}
      </DialogContent>
    </Dialog>
  );
};
