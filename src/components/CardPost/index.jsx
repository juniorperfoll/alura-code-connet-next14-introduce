import Link from "next/link"
import Image from "next/image"
import { Avatar } from "../Avatar"
import styles from './cardpost.module.css'

export const CardPost = ({ post, highlight }) => {
    return (
        <Link
            href={`/posts/${post.slug}`}
            className={styles.link}>
                
            <article className={styles.card} style={{ width: highlight ? 993 : 486}}>
                <header className={styles.header}>
                    <figure>
                        <Image
                            src={post.cover}
                            width={438}	                            
                            height={133}
                            alt={`Capa do post de titulo: ${post.title}`}
                        />
                    </figure>
                </header>
                <section className={styles.body}>
                    <h2>{post.title}</h2>
                    <p>{post.body}</p>
                </section>
                <footer className={styles.footer}>
                    <Avatar
                        imageSrc={post.author.avatar}
                        name={post.author.username}
                    />
                </footer>
            </article>
        </Link>
    )
}