'use client';

import { useState, useEffect } from 'react';
import type { Optional } from 'utility-types';
import { z } from 'zod';
import { type SubmitHandler, Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { api, type RouterOutputs } from '~/trpc/react';
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
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectGroup,
  SelectLabel,
  SelectItem,
} from '~/components/ui/select';
import { Field, FieldError, FieldGroup, FieldLabel } from '~/components/ui/field';
import { DatePicker } from '~/components/ui/date-picker';
import { DeletePopover } from '~/components/delete-popover';
import { Button } from '~/components/ui/button';
import { useUserPreferences } from '~/contexts/user-preferences-context';
import { getFormatters } from '~/lib/formatters';
import { createDateOnlyString } from '~/lib/create-date-only-string';
import { errorToast } from '~/lib/error-toast';

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
  positions: RouterOutputs['positions']['getAll'] | undefined;
  selected: number | null;
  setSelected: React.Dispatch<React.SetStateAction<number | null>>;
  getDefaultValues: (id: number | null) => Optional<FormSchema, 'date'>;
  defaultMonth: Date;
}> = ({ positions = [], selected, setSelected, getDefaultValues, defaultMonth }) => {
  const utils = api.useUtils();

  const userPreferences = useUserPreferences();
  const { currency: cf } = getFormatters(userPreferences);

  const [isOpen, setIsOpen] = useState(false);

  const canCreate = positions.length > 0;

  const { handleSubmit, reset, control } = useForm<FormSchema>({
    resolver: zodResolver(formSchema),
  });

  const { mutate: create } = api.jobs.create.useMutation({
    onSuccess: () => utils.jobs.invalidate(),
    onError: () => errorToast(),
  });

  const { mutate: update } = api.jobs.update.useMutation({
    onSuccess: () => utils.jobs.invalidate(),
    onError: () => errorToast(),
  });

  const { mutate: remove } = api.jobs.delete.useMutation({
    onSuccess: () => utils.jobs.invalidate(),
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
    reset(getDefaultValues(selected));

    if (selected) setIsOpen(true);
  }, [selected, reset, getDefaultValues]);

  return (
    <Dialog
      onOpenChange={(state) => {
        setIsOpen(state);

        if (!state) {
          setSelected(null);
          reset(getDefaultValues(null));
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
              <FieldGroup>
                <Controller
                  name="date"
                  control={control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <div className="flex flex-wrap justify-between gap-x-4 gap-y-2">
                        <FieldLabel htmlFor="date">
                          Date: <span className="text-red-500">*</span>
                        </FieldLabel>
                        {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                      </div>

                      <DatePicker
                        invalid={fieldState.invalid}
                        id="date"
                        date={field.value}
                        setDate={field.onChange}
                        locale={userPreferences.locale}
                        defaultMonth={defaultMonth}
                      />
                    </Field>
                  )}
                />
              </FieldGroup>

              <FieldGroup>
                <Controller
                  name="location"
                  control={control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <div className="flex flex-wrap justify-between gap-x-4 gap-y-2">
                        <FieldLabel htmlFor="location">
                          Location: <span className="text-red-500">*</span>
                        </FieldLabel>
                        {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                      </div>

                      <Input
                        {...field}
                        id="location"
                        type="text"
                        placeholder="Location"
                        className="bg-background border-border text-foreground"
                        aria-invalid={fieldState.invalid}
                      />
                    </Field>
                  )}
                />
              </FieldGroup>

              <FieldGroup>
                <Controller
                  name="event"
                  control={control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <div className="flex flex-wrap justify-between gap-x-4 gap-y-2">
                        <FieldLabel htmlFor="event">Event:</FieldLabel>
                        {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                      </div>

                      <Input
                        {...field}
                        id="event"
                        type="text"
                        placeholder="Event"
                        className="bg-background border-border text-foreground"
                        aria-invalid={fieldState.invalid}
                      />
                    </Field>
                  )}
                />
              </FieldGroup>

              <FieldGroup>
                <Controller
                  name="positionId"
                  control={control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <div className="flex flex-wrap justify-between gap-x-4 gap-y-2">
                        <FieldLabel htmlFor="positionId">
                          Position: <span className="text-red-500">*</span>
                        </FieldLabel>
                        {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                      </div>

                      <Select
                        {...field}
                        onValueChange={field.onChange}
                        aria-invalid={fieldState.invalid}
                      >
                        <SelectTrigger id="positionId" aria-invalid={fieldState.invalid}>
                          <SelectValue placeholder="Select position" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectGroup>
                            <SelectLabel>Positions</SelectLabel>
                            {positions.map((position) => (
                              <SelectItem key={position.id} value={position.id.toString()}>
                                {position.name} ({cf.format(position.wage)})
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
                  name="hours"
                  control={control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <div className="flex flex-wrap justify-between gap-x-4 gap-y-2">
                        <FieldLabel htmlFor="hours">
                          Hours: <span className="text-red-500">*</span>
                        </FieldLabel>
                        {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                      </div>

                      <Input
                        {...field}
                        id="hours"
                        type="text"
                        placeholder="Hours"
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
