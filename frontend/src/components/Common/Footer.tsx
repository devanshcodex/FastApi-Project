const socialLinks = [
  { label: "GitHub", href: "https://github.com/devanshcodex/FastApi-Project" },
]

export function Footer() {
  const currentYear = new Date().getFullYear()
  return (
    <footer className="border-t py-4 px-6">
      <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
        <p className="text-muted-foreground text-sm">TaskFlow · {currentYear}</p>
        <div className="flex items-center gap-4">
          {socialLinks.map(({ label, href }) => (
            <a key={label} href={href} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-foreground transition-colors">
              {label}
            </a>
          ))}
        </div>
      </div>
    </footer>
  )
}
