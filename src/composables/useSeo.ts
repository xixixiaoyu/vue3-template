import { useHead } from '@unhead/vue'
import { computed } from 'vue'

export interface MetaOptions {
  title?: string
  description?: string
  keywords?: string
  author?: string
  ogTitle?: string
  ogDescription?: string
  ogImage?: string
  ogUrl?: string
  twitterCard?: string
  robots?: string
}

export function useSeo(options: MetaOptions) {
  const meta = computed(() => {
    const meta: any[] = []

    if (options.description) {
      meta.push({ name: 'description', content: options.description })
    }
    if (options.keywords) {
      meta.push({ name: 'keywords', content: options.keywords })
    }
    if (options.author) {
      meta.push({ name: 'author', content: options.author })
    }
    if (options.robots) {
      meta.push({ name: 'robots', content: options.robots })
    }

    // Open Graph
    if (options.ogTitle || options.title) {
      meta.push({ property: 'og:title', content: options.ogTitle || options.title || '' })
    }
    if (options.ogDescription || options.description) {
      meta.push({
        property: 'og:description',
        content: options.ogDescription || options.description || '',
      })
    }
    if (options.ogImage) {
      meta.push({ property: 'og:image', content: options.ogImage })
    }
    if (options.ogUrl) {
      meta.push({ property: 'og:url', content: options.ogUrl })
    }

    // Twitter Card
    if (options.twitterCard) {
      meta.push({ name: 'twitter:card', content: options.twitterCard })
    }
    if (options.ogTitle || options.title) {
      meta.push({ name: 'twitter:title', content: options.ogTitle || options.title || '' })
    }
    if (options.ogDescription || options.description) {
      meta.push({
        name: 'twitter:description',
        content: options.ogDescription || options.description || '',
      })
    }
    if (options.ogImage) {
      meta.push({ name: 'twitter:image', content: options.ogImage })
    }

    return meta
  })

  useHead({
    title: options.title,
    meta,
  })
}

export default useSeo
