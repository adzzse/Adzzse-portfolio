import { RiJavaLine } from 'react-icons/ri'
import {
  SiNodedotjs,
  SiDotnet,
  SiSharp,
  SiCplusplus,
  SiMysql
} from 'react-icons/si'
import {
  TbBrandCpp,
  TbBrandJavascript,
  TbBrandMongodb,
  TbBrandNextjs,
  TbBrandReact,
  TbBrandTailwind,
  TbBrandTypescript,
} from 'react-icons/tb'

const tools = [
  { icon: RiJavaLine, color: '#f89820' },
  { icon: TbBrandNextjs, color: 'var(--text)' }, // Use CSS variable for theme adaptation
  { icon: TbBrandReact, color: '#61DAFB' },
  { icon: TbBrandTailwind, color: '#06B6D4' },
  { icon: TbBrandJavascript, color: '#f7df1e' },
  { icon: TbBrandTypescript, color: '#3178c6' },
  { icon: SiDotnet, color: '#5C2D91' },
  { icon: SiSharp, color: '#239120' },
  { icon: SiMysql, color: '#CC2927' },
]

export function Tools() {
  return (
    <div className="cursor-target col-span-3 grid grid-cols-9 gap-2 rounded-[10px] bg-white dark:bg-black p-3 text-left ring-1 ring-gray-200 dark:ring-white/10">
      {tools.map((tool, index) => {
        const Icon = tool.icon
        return (
          <div
            key={index}
            className="flex items-center justify-center text-2xl"
            style={{ color: tool.color }}
          >
            <Icon />
          </div>
        )
      })}
    </div>
  )
}

