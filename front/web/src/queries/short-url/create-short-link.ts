import { useMutation, type UseMutationOptions } from "@tanstack/react-query"
import { createShortLink } from "@/http/short-link"
import { type CreateShortLink } from "@/types/short-links"
import { invalidateShortLinks } from "./list-short-links"
import { toast } from "react-toastify"
import { AxiosError } from "axios"

export function useCreateShortLink(
  options?: Omit<UseMutationOptions<{ id: string }, Error, CreateShortLink, unknown>, 'mutationFn' | 'onSuccess'>
) {
  const mutation = useMutation({
    mutationFn: async (data: CreateShortLink) => createShortLink(data),
    onSuccess: async () => {
      await invalidateShortLinks()
      toast.success('Link salvo com sucesso')
    },
    onError: (error) => {
      if (error instanceof AxiosError && error.response?.status === 400) {
        toast.error(error.response?.data.message)
      } else {
        toast.error('Erro ao salvar link')
      }
    },
    ...(options ?? {}),
  })

  return {
    createShortLink: mutation.mutateAsync,
    ...mutation,
  }
}