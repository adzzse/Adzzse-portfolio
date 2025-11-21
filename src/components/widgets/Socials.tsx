import { AiOutlineDiscord } from 'react-icons/ai'
import { TbBrandGithub } from 'react-icons/tb'

interface SocialsProps {
  discordId: string
}

export function Socials({ discordId }: SocialsProps) {
  return (
    <div className="cursor-target col-span-1 flex justify-center rounded-[10px] bg-white dark:bg-black p-3 text-left ring-2 ring-black/10 dark:ring-white/10">
      <div>
        <p className="text-xs text-gray-600 dark:text-white/60">Contact me</p>
        <div className="flex items-center gap-2 mt-2">
          <a
            href="https://github.com/adzzse"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-600 dark:text-white/60 transition-colors duration-200 hover:text-gray-900 dark:hover:text-white"
            aria-label="GitHub Profile"
          >
            <TbBrandGithub className="h-5 w-5" />
          </a>
          <a
            href={`https://discordapp.com/users/${discordId}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-600 dark:text-white/60 transition-colors duration-200 hover:text-[#4682b4]"
            aria-label="Discord Profile"
          >
            <AiOutlineDiscord className="h-5 w-5" />
          </a>
        </div>
      </div>
    </div>
  )
}

