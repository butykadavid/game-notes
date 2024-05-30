export const metadata = {
  title: 'GameNotes',
  description: 'Web app for gamers',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
        <body>{children}</body>
    </html>
  )
}