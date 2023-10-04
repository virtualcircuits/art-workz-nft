import Image from 'next/image'
// Convert your cache.json into data to display your nfts
import { data } from '../../static/data'

const styles = {
  wrapper:
    'bg-animate flex-1 rounded-3xl flex lg:flex-row items-center relative absolute inset-0 flex snap-y items-center gap-4 overflow-y-scroll w-[calc(100% + 2rem)] px-0 py-[1rem] mt-5',
  //'bg-animate flex-1 rounded-3xl flex lg:flex-col items-center relative absolute inset-0 flex snap-x items-center gap-4 overflow-x-scroll h-81 px-[1rem] py-[1rem]',
  imageContainer:
    'relative h-[120px] w-[120px] flex-shrink-0 snap-center lg:h-[240px] lg:w-[240px]',
  nftImage: `rounded-[1rem] object-cover`,
}

const NFTDisplay = () => {
  return (
    <div className={styles.wrapper}>
      {data.items.map((nft, index) => (
        < div key={index} className={styles.imageContainer} >
          <Image className={styles.nftImage} src={nft.image_link} layout='fill' alt='nft' />
        </div>
      ))
      }
    </div >
  )
}

export default NFTDisplay
