import { useEffect, useState } from 'react'

interface VerificationProps {
  discordIds: string[]
}

export function Verification({ discordIds }: VerificationProps) {
  const [inputValue, setInputValue] = useState('')
  const [status, setStatus] = useState<'verified' | 'impersonator' | null>(
    null
  )

  useEffect(() => {
    if (!inputValue) {
      setStatus(null)
      return
    }

    if (discordIds.includes(inputValue)) {
      setStatus('verified')
    } else {
      setStatus('impersonator')
    }
  }, [inputValue, discordIds])

  return (
    <div className="cursor-target col-span-3 rounded-[10px] bg-white dark:bg-black p-3 text-left ring-2 ring-black/10 dark:ring-white/10">
      <div>
        <p className="text-xs text-gray-600 dark:text-white/60">Discord ID Verification</p>
        <div className="mt-2">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => {
              if (/^[0-9]*$/.test(e.target.value)) {
                setInputValue(e.target.value)
              }
            }}
            placeholder={discordIds[0]}
            className="w-full rounded-md bg-gray-100 dark:bg-white/10 px-2 py-1 text-sm text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-white/30 ring-1 ring-gray-300 dark:ring-white/20 focus:outline-none focus:ring-2 focus:ring-[#4682b4]"
          />
        </div>
      </div>
      {status === 'verified' && (
        <p className="mt-2 text-xs text-green-500">It is me!</p>
      )}
      {status === 'impersonator' && (
        <p className="mt-2 text-xs text-red-500">Impersonator</p>
      )}
    </div>
  )
}

