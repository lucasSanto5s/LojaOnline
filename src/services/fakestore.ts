export type ApiProduct = {
  id: number
  title: string
  price: number
  description: string
  category: string
  image: string
  rating?: { rate: number; count: number }
}

// pega N produtos (vamos usar 5)
export async function fetchTopProducts(n = 5): Promise<ApiProduct[]> {
  const ctrl = new AbortController()
  const t = setTimeout(() => ctrl.abort(), 15000) // 15s timeout

  try {
    const res = await fetch('https://fakestoreapi.com/products', {
      signal: ctrl.signal,
      cache: 'no-store',
    })
    if (!res.ok) throw new Error('Falha ao buscar produtos')
    const data: ApiProduct[] = await res.json()

    // no PDF é “Top 5 Products” — só pegue os 5 primeiros
    return data.slice(0, n)
  } finally {
    clearTimeout(t)
  }
}
