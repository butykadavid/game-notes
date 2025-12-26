import '../app/globals.css'

import NavBar from '../components/NavBarComponent'
import Footer from '../components/FooterComponent'

export default function MyApp({ Component, pageProps }) {

  return <>
    <NavBar />
    <div style={{height: `10vh`}}></div>
    <Component {...pageProps} />
    <Footer />
  </>
}