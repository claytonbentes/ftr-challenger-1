import axios from "axios"
import { type CreateShortLink, type ShortLink } from "../types/short-links"
import { API_URL } from "./../utils/constants"

const api = axios.create({
  baseURL: API_URL ?? '/api'
})

// Log para debug
console.log('API_URL configurada:', API_URL)

// Interceptor para debug
api.interceptors.request.use(request => {
  console.log('Request:', request.method?.toUpperCase(), request.url, request.baseURL)
  return request
})

api.interceptors.response.use(
  response => {
    console.log('Response:', response.status, response.config.url)
    return response
  },
  error => {
    console.error('Error:', error.response?.status, error.config?.url, error.response?.data)
    return Promise.reject(error)
  }
)

export async function listShortLinks(): Promise<ShortLink[]> {
  const response = await api.get<{ urls: ShortLink[], total: number }>('/urls')
  return response.data.urls.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
}

export async function createShortLink(data: CreateShortLink): Promise<{ id: string }> {
  const response = await api.post<{ id: string }>('/urls', {
    originalUrl: data.originalUrl,
    shortUrl: data.slug
  })
  return response.data
}

export async function deleteShortLink(id: string): Promise<void> {
  console.log('Deletando link com ID:', id)
  await api.delete(`/urls/${id}`)
}

export async function getOriginalLinkBySlug(slug: string): Promise<{ id: string; originalUrl: string }> {
  const response = await api.get<{ id: string; originalUrl: string }>(`/urls/${slug}`)
  return response.data
}

export async function incrementAccessCount(id: string): Promise<void> {
  console.log('Incrementando contador para ID:', id)
  await api.patch(`/urls/${id}`)
}

export async function exportShortLinksCsv(): Promise<{ reportUrl: string }> {
  const response = await api.post<{ reportUrl: string }>(`/urls/exports`)
  return response.data
}