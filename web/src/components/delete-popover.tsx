import { Popover, PopoverContent, PopoverTrigger } from '~/components/ui/popover';
import { Button } from '~/components/ui/button';

export function DeletePopover({ type, onDelete }: { type: string; onDelete: () => void }) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="destructive" type="button">
          Delete
        </Button>
      </PopoverTrigger>
      <PopoverContent className="flex flex-col gap-6">
        <div className="flex flex-col gap-1.5">
          <p className="leading-none font-medium">Delete {type}</p>
          <p className="text-muted-foreground text-sm">
            Are you sure you want to delete this {type}? This action is{' '}
            <b>permanent and irreversible</b>.
          </p>
        </div>

        <Button variant="destructive" type="button" onClick={onDelete}>
          Delete {type}
        </Button>
      </PopoverContent>
    </Popover>
  );
}
