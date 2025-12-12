import { useMutation, type UseMutationOptions } from "@tanstack/react-query"
import { deleteShortLink } from "@/http/short-link"
import { invalidateShortLinks } from "./list-short-links"
import { toast } from "react-toastify"
import { AxiosError } from "axios"

export function useDeleteShortLink(
  options?: Omit<UseMutationOptions<void, Error, string, unknown>, 'mutationFn' | 'onSuccess'>
) {
  const mutation = useMutation({
    mutationFn: (id: string) => deleteShortLink(id),
    onSuccess: async () => {
      await invalidateShortLinks()
      toast.success('Link deletado com sucesso')
    },
    onError: (error) => {
      if (error instanceof AxiosError && error.response?.status === 400) {
        toast.error(error.response?.data.message)
      } else {
        toast.error('Erro ao deletar link')
      }
    },
    ...(options ?? {}),
  })

  return {
    deleteShortLink: mutation.mutate,
    ...mutation,
  }
}