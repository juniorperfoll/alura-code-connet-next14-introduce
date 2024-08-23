import { CardPost } from "@/components/CardPost";
import logger from "@/logger";
import Link from "next/link"
import styles from './page.module.css'
import db from "../../prisma/db";

async function getAllPosts(page, searchTerm) {
  /*const response = await fetch(`http://localhost:3042/posts?_page=${page}&_per_page=6`)
  if (!response.ok) {
    logger.error('Ops, problema ao comunicar com a API posts')
    return []
  }
  logger.info('Posts obtidos com sucesso da API')
  return response.json();*/
  //funcoes do prisma
  try {

    const where = {}

    if (searchTerm) {
      where.title = {
        contains: searchTerm,
        mode: 'insensitive'
      }
    }

    const perPage = 6;
    const skip = (page - 1) * perPage

    const totalItems = await db.post.count({ where })

    const totalPages = Math.ceil(totalItems / perPage)
    const next = page < totalPages ? page + 1 : null

    const prev = page > 1 ? page - 1 : null

    const posts = await db.post.findMany({
      take: perPage, //pegar 6 por pagina
      skip,
      where,
      orderBy: { createdAt: 'desc' },
      include: {
        author: true
      }
    })
    return { data: posts, prev, next }
  } catch (error) {
    logger.error('Falha ao obter posts', { error })
    return { data: [], prev: null, next: null }
  }
}

export default async function Home({ searchParams }) {
  const currentPage = parseInt(searchParams?.page || 1)
  const searchTerm = searchParams?.q
  const { data: posts, prev, next } = await getAllPosts(currentPage, searchTerm);
  return (
    <main className={styles.grid}>
      {posts.map(post => <CardPost key={post.id} post={post} />)}
      <div className={styles.links}>
        {prev && <Link href={{ pathname: '/', query: { page: prev, q: searchTerm } }}>Página anterior</Link>}
        {next && <Link href={{ pathname: '/', query: { page: next, q: searchTerm } }}>Próxima página</Link>}
      </div>
    </main >
  );
}
