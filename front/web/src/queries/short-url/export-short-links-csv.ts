import { useMutation, type UseMutationOptions } from "@tanstack/react-query"
import { exportShortLinksCsv } from "@/http/short-link"
import { toast } from "react-toastify"
import { AxiosError } from "axios"

export function useExportShortLinksCsv(
  options?: Omit<UseMutationOptions<{ reportUrl: string }, Error, void, unknown>, 'mutationFn' | 'onSuccess'>
) {
  const mutation = useMutation({
    mutationFn: async () => exportShortLinksCsv(),
    onSuccess: async () => {
      toast.success('CSV exportado com sucesso')
    },
    onError: (error) => {
      if (error instanceof AxiosError && error.response?.status === 400) {
        toast.error(error.response?.data.message)
      } else {
        toast.error('Erro ao exportar CSV')
      }
    },
    ...(options ?? {}),
  })

  return {
    exportShortLinksCsv: mutation.mutateAsync,
    ...mutation,
  }
}