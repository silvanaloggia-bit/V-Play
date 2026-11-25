import type { TeamMember } from '../types/teamMember'

export const teamMembers: TeamMember[] = [
  {
    id: 'silvana',
    name: 'Silvana',
    tagline: 'La que eligió el plan',
    role: 'Team Leader',
    description:
      'Diseñó la experiencia de VPLAY y armó la página 404, los planes, el login y el registro de usuarios.',
  },
  {
    id: 'lucas',
    name: 'Lucas Díez',
    tagline: 'El guardián del catálogo',
    role: 'Scrum Master',
    description: 'Cargó películas y series, y creó el panel de administración con los tops.',
  },
  {
    id: 'julian',
    name: 'Julián Medina',
    tagline: 'El que abre las puertas',
    role: 'Developer',
    description: 'Hizo el inicio de sesión y el banner principal de la Home.',
  },
  {
    id: 'luciana',
    name: 'Luciana',
    tagline: 'Los créditos finales',
    role: 'Developer',
    description:
      'Creó el navbar, el footer, esta página de Acerca de nosotros y los perfiles de usuario.',
  },
]