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
import { Input } from '~/components/ui/input';
import { Label } from '~/components/ui/label';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { api } from '~/trpc/react';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { Button } from './ui/button';

export const formSchema = z.object({
  name: z.string().min(1, { message: 'Please specify a name!' }),
  wage: z
    .string()
    .min(1, { message: 'Please specify a wage!' })
    .refine((wage) => !isNaN(parseInt(wage)), { message: 'Please specify a valid wage!' }),
});

export const WageDialog: React.FC = () => {
  const router = useRouter();

  const [isOpen, setIsOpen] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<{ name: string; wage: string }>({ resolver: zodResolver(formSchema) });

  const { mutate } = api.wage.create.useMutation({
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
          <DialogTitle>Add new position</DialogTitle>
          <DialogDescription>
            Use this form to add a new position. Once completed, click the &quot;Save changes&quot;
            button to add the position to the database.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit((data) => mutate({ ...data, wage: parseInt(data.wage) }))}>
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
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
