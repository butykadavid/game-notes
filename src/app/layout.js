export const metadata = {
  title: 'GameNotes',
  description: 'Web app for gamers',
}

import { SpeedInsights } from "@vercel/speed-insights/next"

export default function RootLayout({ children }) {
  return (
    <html lang="en">
        <body>{children}</body>
        <SpeedInsights />
    </html>
  )
}