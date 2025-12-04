import { Popover, PopoverContent, PopoverTrigger } from '~/components/ui/popover';
import { Button } from '~/components/ui/button';

export const DeletePopover: React.FC<{
  type: string;
  onDelete: () => void;
}> = ({ type, onDelete }) => (
  <Popover>
    <PopoverTrigger asChild>
      <Button variant="destructive" type="button" size="sm">
        Delete
      </Button>
    </PopoverTrigger>
    <PopoverContent className="flex flex-col gap-6">
      <div className="flex flex-col gap-1.5">
        <p className="font-medium leading-none">Delete {type}</p>
        <p className="text-sm text-neutral-400">
          Are you sure you want to delete this {type}? This action is{' '}
          <b>permanent and irreversible</b>.
        </p>
      </div>

      <Button variant="destructive" type="button" onClick={onDelete} size="sm">
        Delete {type}
      </Button>
    </PopoverContent>
  </Popover>
);
