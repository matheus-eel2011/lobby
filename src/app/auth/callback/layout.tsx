import { connection } from 'next/server'

export default async function CallbackLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // Aguarda uma request real, não permite prerender
  await connection()
  
  return children
}
