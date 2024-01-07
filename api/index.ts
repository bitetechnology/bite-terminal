import { useAsyncEffect } from "ahooks";
import { useState } from "react";

const useQuery = <T, R>(query: () => Promise<{ data: T; error: R }>) => {
  const [queryData, setQueryData] = useState<T | null>(null);
  const [queryError, setQueryError] = useState<R | null>(null);
  const [isLoading, setLoading] = useState(true);

  useAsyncEffect(async () => {
    setLoading(true);
    try {
      const { data, error } = await query();
      setQueryData(data);
      setQueryError(error);
    } catch (error) {
      setQueryError(error as R);
    } finally {
      setLoading(false);
    }
  }, [query]);

  return { data: queryData, error: queryError, isLoading };
};

export default useQuery;
