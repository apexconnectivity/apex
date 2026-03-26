import useSWR from 'swr'

const fetcher = (url: string) => fetch(url).then(res => res.json())

export function useFetcher<T>(key: string) {
  const { data, error, isLoading, mutate } = useSWR<T>(key, fetcher)
  
  return {
    data,
    isLoading,
    isError: error,
    mutate,
  }
}