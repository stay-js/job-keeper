'use client';

import { useState, useEffect } from 'react';
import { type SubmitHandler, Controller, useForm } from 'react-hook-form';
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
import { Field, FieldError, FieldGroup, FieldLabel } from '~/components/ui/field';
import { Button } from '~/components/ui/button';
import { errorToast } from '~/lib/error-toast';
import { DeletePopover } from './delete-popover';

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

  const { handleSubmit, control, reset } = useForm<FormSchema>({
    resolver: zodResolver(formSchema),
  });

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
                name="wage"
                control={control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <div className="flex flex-wrap justify-between gap-x-4 gap-y-2">
                      <FieldLabel htmlFor="wage">
                        Hourly Wage: <span className="text-red-500">*</span>
                      </FieldLabel>
                      {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                    </div>

                    <Input
                      {...field}
                      id="wage"
                      type="text"
                      placeholder="Hourly Wage"
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
