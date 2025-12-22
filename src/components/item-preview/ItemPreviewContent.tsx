import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import BackButton from '@/components/common/BackButton'
import ArticleCard from '@/components/common/ArticleCard'
import { MOCK_ARTICLES, type ArticleModel } from '@/data/Article'
import { cn } from '@/lib/utils'

const ItemPreviewContent = () => {
      const [isClient, setIsClient] = useState(true)
  const [article, setArticle] = useState<ArticleModel>(MOCK_ARTICLES[0])
  const navigate = useNavigate()

  useEffect(() => {
    // Start hydration cycle
    setIsClient(false)

    // Simulate any client-side data fetching or state initialization
    // In a real app, you might fetch article data from query params or context
    const queryParams = new URLSearchParams(
      typeof window !== 'undefined' ? window.location.search : ''
    )
    const articleId = queryParams.get('id')

    if (articleId && typeof window !== 'undefined') {
      const foundArticle = MOCK_ARTICLES.find(a => a.id === articleId)
      if (foundArticle) {
        setArticle(foundArticle)
      }
    }

    // Complete hydration
    requestAnimationFrame(() => {
      setIsClient(true)
    })
  }, [])

  const handleReadFull = () => {
    if (isClient) {
      navigate(`/reading-view/${article.id}`)
    }
  }

  const handleSkimSummary = () => {
    if (isClient) {
      navigate(`/reading-view/${article.id}`, { state: { mode: 'skim' } })
    }
  }

  const handleBack = () => {
    if (isClient) {
      navigate('/todays-reads')
    }
  }
  return (
    // min-h-screen to ensure full background color
   <main className="min-h-screen bg-background">
      {/* Header with back button */}
      <div className="border-border bg-background sticky top-0 z-10">
        <div className="container-app py-4">
          <BackButton 
            href="/"
            label="Back to Today's Reads"
            className={(isClient || true) ? 'opacity-100' : 'opacity-50'}
          />
        </div>
      </div>

      {/* Content */}
      <div className="container-app py-8 md:py-12">
        <div className="max-w-2xl mx-auto">
          {/* Article Preview Card */}
          <ArticleCard
            variant="preview"
            title={article.title}
            source={article.source.name}
            readTime={article.readingTimeInMinutes}
            skimTime={article.skimTimeInMinutes}
            summary={article.tldrSummary}
            onRead={handleReadFull}
            onSkim={handleSkimSummary}
            className={cn(
              'transition-all duration-300',
              (isClient || true) ? 'opacity-100 translate-y-0' : 'opacity-75 translate-y-2'
            )}
          />

          {/* Additional context */}
          <div className="mt-8 text-center text-sm text-muted-foreground">
            <p>
              Saved {article.saveDate} • Complexity: {article.complexity}
            </p>
          </div>
        </div>
      </div>
    </main>
  )
}

export default ItemPreviewContent
