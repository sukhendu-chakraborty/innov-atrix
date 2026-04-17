import Navbar from "./components/landing-page/Navbar"
import Hero from "./components/landing-page/Hero"
import Footer from "./components/landing-page/Footer"

export default function App() {
  return (
    <div className="bg-black w-screen">
      <Navbar />
      <Hero />
      <Footer />
    </div>
  )
}