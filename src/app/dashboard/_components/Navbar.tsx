import Image from "next/image"
import Link from "next/link"

export function NavBar() {
  return (
    <header className="flex py-4 shadow bg-background">
      <nav className="flex items-center gap-10 container text-lg font-semibold">
         <Link href="/dashboard" className="mr-auto">
          <Image 
          src={'/logo.png'}
          alt='logo'
          width={40}
          height={40}
          className="rounded-full object-cover object-center"/>
        </Link>
        <Link href="/dashboard/products">Products</Link>
        <Link href="/dashboard/analytics">Analytics</Link>
        <Link href="/dashboard/subscription">Subscription</Link>
        
      </nav>
    </header>
  )
}