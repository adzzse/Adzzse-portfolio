import { TbWorld, TbBrandTypescript } from 'react-icons/tb'
import { RiJavaLine } from 'react-icons/ri'

const projects = [
  {
    name: 'Adzzse',
    description: 'My portfolio website.',
    tech: [
      { icon: TbBrandTypescript, color: '#3178c6' },
      { icon: RiJavaLine, color: '#f89820' },
    ],
    link: 'https://github.com/adzzse/Adzzse-portfolio',
  },
  {
    name: 'Estellav0',
    description: 'A minecraft experimental mod.',
    tech: [{ icon: TbBrandTypescript, color: '#3178c6' },
    { icon: RiJavaLine, color: '#f89820' },
    ],

  },
]

export function Projects() {
  return (
    <div className="cursor-target projectsScroll flex w-full flex-col rounded-[10px] bg-white dark:bg-black p-6 ring-2 ring-black/10 dark:ring-white/10 lg:h-full lg:overflow-y-auto">
      <div>
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Projects</h2>
        <div className="mt-1 h-1 w-10 bg-[#4682b4]" />
      </div>
      <div className="mt-4 flex h-full flex-col">
        <div className="flex flex-col">
          {projects.map((project, index) => (
            <div key={project.name}>
              {index > 0 && <hr className="my-4 border-gray-300 dark:border-white/10" />}
              <div className="inline-flex items-center gap-1.5">
                <h3 className="font-semibold text-gray-900 dark:text-white">{project.name}</h3>
                {project.link && (
                  <a
                    href={project.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex"
                  >
                    <TbWorld
                      className="text-gray-600 dark:text-white/60 transition-colors duration-200 hover:text-[#4682b4]"
                      style={{ transform: 'translateY(-3px)' }}
                      size={13}
                    />
                  </a>
                )}
              </div>
              <p className="text-sm text-gray-600 dark:text-white/60">{project.description}</p>
              <div className="mt-2 flex flex-wrap items-center gap-2">
                {project.tech.map((tech, i) => {
                  const Icon = tech.icon
                  return <Icon key={i} size={15} color={tech.color} />
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

