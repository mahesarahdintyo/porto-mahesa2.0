export interface Profile {
  id: string
  name: string
  title: string
  intro_light: string
  intro_dark: string
  email: string
  github_url: string
  linkedin_url: string
  updated_at?: string
}

export interface About {
  id: string
  eyebrow: string
  heading: string
  paragraph_1: string
  paragraph_2: string
  updated_at?: string
}

export interface Skill {
  id: string
  name: string
  category: string
  order_index: number
  created_at?: string
}

export interface Project {
  id: string
  title: string
  description: string
  tag: string
  link_url: string
  github_url: string
  order_index: number
  is_published: boolean
  created_at?: string
}

export interface Message {
  id: string
  name: string
  email: string
  message: string
  is_read: boolean
  created_at: string
}
