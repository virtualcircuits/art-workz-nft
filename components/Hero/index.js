const styles = {
  wrapper: 'flex w-full items-center justify-center pt-4 lg:pt-8',
  container: 'space-y-3',
  heroTitle: 'xl:pr-50 text-5xl font-bold',
  heroParagraph: 'xl:pr-40',
  heroCta: 'flex items-center space-x-10',
  mintButton:
    'rounded-xl border border-gray-100 bg-transparent px-8 py-4 font-semibold text-gray-100 transition-all hover:bg-gray-100 hover:text-[#1d1d1d]',
}

const Hero = () => {

  return (
    <main className={styles.wrapper}>
      <div className={styles.container}>
        <h1 className={styles.heroTitle}>Art Workz NFT</h1>
        <p className={styles.heroParagraph}>
          by: virtualcircuits
        </p>
        <p className={styles.heroParagraph}>
        Art Workz NFT comprises a distinct 24x24 pixel artworks, each randomly generated and securely stored on the Solana blockchain. Designed with accessibility in mind, these artworks aim to establish a presence on the blockchain and foster their community. Owners enjoy exclusive benefits like NFT ownership and access to a community wallet. The metadata for Art Workz NFT is permanently stored on Arweave, a decentralized and permanent data storage solution.
        </p>
        <div className={styles.heroCta}>
        </div>
      </div>
    </main>
  )
}

export default Hero
