import './globals.css'
import { Providers } from './providers'
import Starfield from '@/components/starfield'

export const metadata = {
  title: 'Chaitava — Where Science Meets Spirituality',
  description: 'चैतव · Ancient wisdom, modern science, and every human question — answered with four honest perspectives.',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght,SOFT,WONK@9..144,300..900,0..100,0..1&family=Cormorant+Garamond:ital,wght@0,300..700;1,300..700&family=Inter:wght@300..700&family=Space+Grotesk:wght@400;500;600;700&family=Tiro+Devanagari+Sanskrit:ital@0;1&display=swap"
          rel="stylesheet"
        />
        <script dangerouslySetInnerHTML={{__html:'window.addEventListener("error",function(e){if(e.error instanceof DOMException&&e.error.name==="DataCloneError"&&e.message&&e.message.includes("PerformanceServerTiming")){e.stopImmediatePropagation();e.preventDefault()}},true);'}} />
      </head>
      <body className="font-sans antialiased bg-[#0a0416] text-slate-100 min-h-screen">
        <Starfield />
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
