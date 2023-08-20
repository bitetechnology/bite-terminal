import Script from 'next/script'
import '../app/globals.css'

function MyApp({ Component, pageProps }) {
  return (
    <>
      <Script src="./node_modules/preline/dist/preline.js" />
      <Component {...pageProps} />
    </>
  )
}

export default MyApp
