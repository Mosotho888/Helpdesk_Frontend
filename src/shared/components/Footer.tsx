export function Footer() {
  return (
    <footer className="border-t mt-auto py-4 px-6 text-sm text-muted-foreground flex flex-col sm:flex-row items-center justify-between gap-2">
      <span>&copy; {new Date().getFullYear()} Sothoman. Built by Tebogo Mofokeng.</span>
      
      <div className="flex items-center gap-4">
        <a
          href="https://github.com/Mosotho888/Helpdesk_Frontend"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:underline"
        >
          View on GitHub
        </a>
      </div>
    </footer>
  )
}