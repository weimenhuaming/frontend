export interface NavItem {
  label: string
  to: string
  external?: boolean
}

export interface SocialLink {
  label: string
  href: string
  icon: 'github' | 'twitter' | 'rss' | 'email'
}

export interface BlogPost {
  slug: string
  title: string
  description: string
  publishedAt: string
  updatedAt?: string
  tags: string[]
  cover?: string
  readingTime?: number
}

export interface SiteConfig {
  name: string
  description: string
  author: string
  url: string
}
