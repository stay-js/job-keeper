import { useCallback } from 'react';
import type { ReadonlyURLSearchParams } from 'next/navigation';

export function useCreateQueryString(searchParams: ReadonlyURLSearchParams) {
  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      params.set(name, value);

      return params.toString();
    },
    [searchParams],
  );

  return createQueryString;
}
