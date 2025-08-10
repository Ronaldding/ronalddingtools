export default function Footer() {
  return (
    <footer className="border-t border-gray-200 bg-white/70 backdrop-blur supports-[backdrop-filter]:bg-white/60">
      <div className="mx-auto max-w-7xl px-6 sm:px-8 py-10">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div className="flex items-center gap-2">
            <BoltIcon className="h-5 w-5 text-gray-900" />
            <span className="font-medium">Ronald Ding's App</span>
          </div>
          <div className="flex items-center gap-6 text-gray-500">
            <a href="https://github.com/Ronaldding" target="_blank" rel="noreferrer" className="hover:text-gray-900 transition-colors" aria-label="GitHub">
              <GitHubIcon className="h-5 w-5" />
            </a>
            <a href="https://www.instagram.com/ronaldding1114/" target="_blank" rel="noreferrer" className="hover:text-gray-900 transition-colors" aria-label="Instagram">
              <InstagramIcon className="h-5 w-5" />
            </a>
            <a href="https://www.linkedin.com/in/ronalddingchunyeung/" target="_blank" rel="noreferrer" className="hover:text-gray-900 transition-colors" aria-label="LinkedIn">
              <LinkedInIcon className="h-5 w-5" />
            </a>
          </div>
        </div>
        <p className="mt-6 text-xs leading-6 text-gray-500 text-center md:text-left">© 2025 Ronald Ding's App. All rights reserved.</p>
      </div>
    </footer>
  );
}

function BoltIcon({ className = "h-5 w-5" }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <path d="M13 3L5 14h6l-1 7 8-11h-6l1-7z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/>
    </svg>
  );
}

function GitHubIcon({ className = "h-5 w-5" }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <path d="M12 2C6.48 2 2 6.58 2 12.26c0 4.5 2.87 8.31 6.84 9.65.5.09.66-.22.66-.48v-1.73c-2.78.62-3.37-1.34-3.37-1.34-.46-1.16-1.11-1.47-1.11-1.47-.91-.64.07-.62.07-.62 1 .07 1.53 1.04 1.53 1.04.89 1.54 2.34 1.1 2.91.84.09-.65.35-1.09.63-1.34-2.22-.25-4.55-1.12-4.55-4.98 0-1.1.39-2 .99-2.69-.11-.25-.45-1.28.09-2.66 0 0 .84-.27 2.75 1.03A9.92 9.92 0 0 1 12 7.05c.85 0 1.71.12 2.52.34 1.91-1.3 2.75-1.03 2.75-1.03.55 1.38.2 2.41.1 2.66.64.71 1.03 1.6 1.03 2.69 0 3.88-2.34 4.73-4.57 4.98.36.31.68.93.68 1.87v2.75c0 .26.18.59.69.48A10.3 10.3 0 0 0 22 12.26C22 6.58 17.52 2 12 2z" />
    </svg>
  );
}

function InstagramIcon({ className = "h-5 w-5" }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
    </svg>
  );
}

function LinkedInIcon({ className = "h-5 w-5" }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14zM8.25 7A2.25 2.25 0 1 0 8.25 11.5 2.25 2.25 0 0 0 8.25 7zM6.75 12.75h3v7.5h-3v-7.5zM12.75 12.75h3v1.5h-3v-1.5zm0 3h3v4.5h-3v-4.5z" />
    </svg>
  );
} 