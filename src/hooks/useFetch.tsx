import { useAuth, useUser } from "@clerk/nextjs";
import { useEffect, useState } from "react";

type ApiCallFn<TResponse, TQuery> = (token: string, query?: TQuery) => Promise<TResponse>;

const useFetch = <TResponse = unknown, TQuery = unknown>(
  apiCallFun: ApiCallFn<TResponse, TQuery>,
  payload?: TQuery,
  initialCall: boolean = false
) => {
  const { getToken } = useAuth();
  const { isLoaded } = useUser();

  const [data, setData] = useState<TResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);

  const makeRequest = async (args?: Partial<TQuery>) => {
    setLoading(true);
    try {
      const token = await getToken({ template: "supabase" });

      if (!token) throw new Error("Token is not defined!");

      const query = {
        ...(payload || {}),
        ...(args || {}),
      } as TQuery;

      const res = await apiCallFun(token, query);
      setData(res);
    } catch (err) {
      setError(err instanceof Error ? err : new Error(String(err)));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (initialCall && isLoaded) {
      makeRequest();
    }
  }, [initialCall, isLoaded]);

  return { data, loading, error, makeRequest };
};

export default useFetch;
