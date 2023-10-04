import Head from "next/head";
import { Header, NFTDisplay, Hero } from '../components'
import { useEffect, useState } from "react";
import { Toaster } from 'react-hot-toast';
import toast from "react-hot-toast"

import {
  guestIdentity,
  Metaplex,
  walletAdapterIdentity,
} from '@metaplex-foundation/js'

import { LAMPORTS_PER_SOL } from "@solana/web3.js";

import { useAnchorWallet, useConnection } from "@solana/wallet-adapter-react";

import { CANDY_MACHINE_ID } from "../utils";

const styles = {
  wrapper: 'flex h-[100vh] w-[100vw] bg-[#7da174] text-gray-200',
  container:
    //'flex flex-row lg:flex-col flex-1 p-5 pr-20 lg:p-10 space-x-10 lg:space-x-0 pb-0 lg:pb-20',
    'flex flex-col lg:flex-row flex-1 p-5 pb-20 lg:p-10 space-y-10 lg:space-y-0',
  buttonContainer: 'flex flex-col lg:flex-row flex-1 pt-5  space-y-10',
  infoSection: 'lg:w-1/3 px-10',
  mobileDisplaySection: 'h-[150px] flex w-full lg:hidden lg:w-1/3 mt-2',
  desktopDisplaySection: 'hidden lg:flex flex-1 lg:w-1/4 xl:pr-15 text-xl font-bold mt-5 pt-5 align-middle',
  mintButton:
    'rounded-xl border border-gray-100 bg-transparent px-8 py-4 font-semibold text-gray-100 transition-all hover:bg-gray-100 hover:text-[#1d1d1d]',
}


export default function Main() {
  const [metaplex, setMetaplex] = useState()

  const [candyState, setCandyState] = useState()
  const [candyStateError, setCandyStateError] = useState();
  const [candyStateLoading, setCandyStateLoading] = useState(true);
  const [txError, setTxError] = useState()
  const [txLoading, setTxLoading] = useState(false)
  const [nfts, setNfts] = useState([])

  const { connection } = useConnection()
  const wallet = useAnchorWallet()

  useEffect(()=>{
    setMetaplex(
      Metaplex.make(connection).use(
        wallet ? walletAdapterIdentity(wallet) : guestIdentity()
      )
    )
  },[connection, wallet])

  //Set up mystate and update it every few seconds
  useEffect(()=>{
    if (!metaplex) return

    const updateState = async () => {
      try{
        const state = await metaplex
          .candyMachines()
          .findByAddress({address: CANDY_MACHINE_ID})
        setCandyState(state);
        setNfts(state.items);
        setCandyStateError(null);
      }catch(e) {
        console.log(e)
        toast.error("Error has occured!")
      } finally{
        setCandyStateLoading(false)
        toast.success("Updated state!")
      }
    }

    updateState();

    //Refresh state every 30 seconds
    const intervalId = setInterval(()=>updateState(), 30_000);

    return ()=> clearInterval(intervalId)

  }, [metaplex])

  const mint = async () => {
    if(!metaplex) return

    setTxLoading(true)
    setTxError(null);

    try{
      const mintResult = await metaplex.candyMachines().mint({
        candyMachine:{
          address: candyState.address,
          collectionMintAddress: candyState.collectionMintAddress,
          candyGuard: candyState.candyGuard,
        },
        collectionUpdateAuthority: candyState.authorityAddress,
        group: null
      })

      console.log({ mintResult })
    } catch(e){
      console.log(e)
      toast.error("Mint failed!")
      setTxError(e.message)
    } finally {
      setTxLoading(false)
      toast.success("Minted NFT")
    }
  }

  const soldOut = candyState?.itemsRemaining.eqn(0)
  const solAmount = candyState?.candyGuard?.guards?.solPayment ? 
    candyState.candyGuard.guards.solPayment.lamports.toNumber() / LAMPORTS_PER_SOL : null;

  return (
    <div className={styles.wrapper}>
      <Toaster
         position="top-center"
         reverseOrder={false}
      />
 
      <Head>
        <title>Home | Art Workz NFT</title>
      </Head>

      <div className={styles.container}>
{/* Section */}
        <section className={styles.infoSection}>
          
          <Header />

          <div className={styles.mobileDisplaySection}>
            {/* Candymachine states will go here! */}
            {candyStateLoading ? (
              <div>Loading</div>
            ) : candyStateError ? (

              <div>{candyStateError}</div>
            ) : (

              candyState && (
                <div>
                  <div>Total items: {candyState.itemsAvailable.toString()}</div>
                  <div>Minted items: {candyState.itemsMinted.toString()}</div>
                  <div>Remaining items: {candyState.itemsRemaining.toString()}</div>
                  {solAmount && <div>Cost: {solAmount} SOL</div>}
                  {txError && <div>{txError}</div>}
                  <div className={styles.buttonContainer}>
                    <button className={styles.mintButton} onClick={mint} disabled={!wallet || txLoading || soldOut}>
                      {soldOut ? "SOLD OUT" : txLoading ? "LOADING" : "MINT"}
                    </button>
                  </div>
                </div>
              )
            )
          
            }
          </div>

          <NFTDisplay />
          <Hero />
          
        </section>
{/* Section */}
        <section className={styles.desktopDisplaySection}>
      
            {/* Candymachine states will go here! */}
            {candyStateLoading ? (
              <div>Loading</div>
            ) : candyStateError ? (

              <div>{candyStateError}</div>
            ) : (

              candyState && (
                <div>
                  <div>Total items: {candyState.itemsAvailable.toString()}</div>
                  <div>Minted items: {candyState.itemsMinted.toString()}</div>
                  <div>Remaining items: {candyState.itemsRemaining.toString()}</div>
                  {solAmount && <div>Cost: {solAmount} SOL</div>}
                  {txError && <div>{txError}</div>}
                  <div className={styles.buttonContainer}>
                    <button className={styles.mintButton} onClick={mint} disabled={!wallet || txLoading || soldOut}>
                      {soldOut ? "SOLD OUT" : txLoading ? "LOADING" : "MINT"}
                    </button>
                  </div>
                </div>
              )
            )
          
            }
          
        </section>
{/* Section */}  
      </div>
    </div>
  )

}


