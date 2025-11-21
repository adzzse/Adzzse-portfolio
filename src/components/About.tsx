import { useEffect, useMemo, useState } from 'react'
import { Grid } from './widgets/Background'
import { Socials } from './widgets/Socials'
import { Birthday } from './widgets/Birthday'
import { Tools } from './widgets/Tools'
import { Verification } from './widgets/Verification'
import { Projects } from './widgets/Projects'

interface LanyardUser {
  id: string
  username: string
  avatar: string | null
  discriminator: string
}

interface LanyardSuccess {
  success: true
  data: {
    discord_user: LanyardUser
    discord_status: 'online' | 'idle' | 'dnd' | 'offline'
    activities: Array<{
      name: string
      type: number
    }>
    active_on_discord_desktop: boolean
    active_on_discord_mobile: boolean
  }
}

type LanyardData = LanyardSuccess | { success: false }

function calculateAge(birthDate: string) {
  const today = new Date()
  const birth = new Date(birthDate)
  let age = today.getFullYear() - birth.getFullYear()
  const m = today.getMonth() - birth.getMonth()
  if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) {
    age--
  }
  return age
}

function useLanyard(userId: string) {
  const [presence, setPresence] = useState<LanyardSuccess['data'] | null>(null)

  useEffect(() => {
    async function getLanyardData() {
      try {
        const res = await fetch(`https://api.lanyard.rest/v1/users/${userId}`)
        if (res.ok) {
          const lanyard: LanyardData = await res.json()
          if (lanyard.success) {
            setPresence(lanyard.data)
          }
        }
      } catch (error) {
        console.error('Failed to fetch Lanyard data:', error)
      }
    }

    getLanyardData()
  }, [userId])

  return presence
}

const discordIds = ['579340597022687292']
const statusColors = {
  online: '#23a55a',
  idle: '#f0b232',
  dnd: '#f23f43',
  offline: '#80848e',
}

export default function About() {
  const presence = useLanyard(discordIds[0] || '')
  const age = calculateAge('2003-01-06')
  const [time, setTime] = useState('')
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    if (presence) {
      setIsLoaded(true)
    }
  }, [presence])

  useEffect(() => {
    const updateTime = () =>
      setTime(
        new Date().toLocaleTimeString('vi-VN', {
          timeZone: 'Asia/Ho_Chi_Minh',
          hour: '2-digit',
          minute: '2-digit',
          hour12: true,
        })
      )

    updateTime()
    const timer = setInterval(updateTime, 1000)

    return () => clearInterval(timer)
  }, [])

  const avatarUrl = useMemo(() => {
    const user = presence?.discord_user
    if (!user) return ''

    if (user.avatar) {
      return `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.png?size=128`
    }

    const defaultAvatarIndex = user.discriminator
      ? parseInt(user.discriminator) % 5
      : 0

    return `https://cdn.discordapp.com/embed/avatars/${defaultAvatarIndex}.png`
  }, [presence])

  const status = presence?.discord_status ?? 'offline'
  const statusColor = statusColors[status]

  return (
    <main className="relative flex min-h-screen items-center justify-center p-6">
      <title>About - Adzzse</title>
      <Grid />
      <div
        className={`relative z-10 flex w-full max-w-4xl flex-col gap-2 transition-opacity duration-500 lg:flex-row lg:items-stretch ${isLoaded ? 'opacity-100' : 'opacity-0'
          }`}
      >
        <div className="flex w-full flex-col gap-2 lg:w-1/2">
          <div className="cursor-target rounded-[10px] bg-white dark:bg-black ring-2 ring-black/10 dark:ring-white/10">
            <div className="flex items-start gap-4 p-6">
              <div className="relative h-20 w-20 shrink-0">
                {avatarUrl && (
                  <img
                    src={avatarUrl}
                    alt="Discord avatar"
                    className="h-full w-full rounded-[10px] object-cover"
                  />
                )}
                <span
                  title={status}
                  className="absolute -bottom-1 -right-1 block h-5 w-5 rounded-full border-3 border-black"
                  style={{ backgroundColor: statusColor }}
                />
              </div>

              <div className="pt-1 text-left">
                <h1 className="mb-0 text-xl font-semibold text-gray-900 dark:text-white">
                  Adzzse
                  {presence?.discord_user?.username && (
                    <span className="text-xs text-gray-500 dark:text-white/40 ml-2 font-normal">
                      {presence.discord_user.username}
                    </span>
                  )}
                </h1>
                <div className="mt-1 h-1 w-10 bg-[#4682b4]" />
                <p className="mt-2 text-sm text-gray-600 dark:text-white/60">
                  {age} y/o Backend Developer(I think so).
                </p>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-2">
            <div className="cursor-target col-span-1 flex justify-center rounded-[10px] bg-white dark:bg-black p-3 text-left ring-2 ring-black/10 dark:ring-white/10">
              <div>
                <p className="text-xs text-gray-600 dark:text-white/60">It is</p>
                <p className="text-lg font-semibold text-gray-900 dark:text-white">{time}</p>
              </div>
            </div>
            <Birthday />
            <Socials discordId={discordIds[0] || ''} />
            <Tools />
            <Verification discordIds={discordIds} />
          </div>
        </div>
        <div className="w-full lg:w-1/2 lg:min-h-0">
          <Projects />
        </div>
      </div>
    </main>
  )
}
