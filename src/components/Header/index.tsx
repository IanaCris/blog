import styles from './header.module.scss';

export default function Header() {
  return (
    <header  className={styles.headerContainer}>
      <div className={styles.headerContect}>
        <nav>
            <a href="/"><img src="/images/logo.svg" alt="logo" /></a>
        </nav>
      </div>
    </header>
  )
}
