'use client';

import type { RouterOutputs } from '~/trpc/react';
import { WagesTable } from '~/components/wages-table';

import { Button } from '~/components/ui/button';
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
import { useState } from 'react';

export const formSchema = z.object({
  name: z.string().min(1, { message: 'Please specify a name!' }),
  wage: z.coerce.number(),
});

type FormSchema = z.infer<typeof formSchema>;

const defaultValues: FormSchema = {
  name: '',
  wage: 0,
};

export const WagesPage: React.FC<{
  data: RouterOutputs['wage']['getAllWithHoursWorked'];
}> = ({ data }) => {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormSchema>({ resolver: zodResolver(formSchema), defaultValues });

  const { mutate } = api.wage.create.useMutation({
    onSuccess: () => {
      router.refresh();
      reset(defaultValues);
      setIsOpen(false);
    },
  });
  return (
    <div className="flex flex-col gap-4">
      <WagesTable data={data} />

      <Dialog onOpenChange={setIsOpen} open={isOpen}>
        <DialogTrigger asChild>
          <Button>Add new</Button>
        </DialogTrigger>
        <DialogContent className="w-11/12 max-w-lg rounded-lg">
          <DialogHeader>
            <DialogTitle>Add new position</DialogTitle>
            <DialogDescription>
              Use this form to add a new position. Once completed, click the &quot;Save
              changes&quot; button to add the position to the database.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit((data) => mutate(data))}>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
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
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="wage" className="text-right">
                  Hourly Wage
                </Label>
                <Input id="wage" className="col-span-3" type="number" {...register('wage')} />
              </div>
            </div>
            <DialogFooter>
              <Button type="submit">Save changes</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};
