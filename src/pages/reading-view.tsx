import { useParams, useNavigate } from "react-router-dom";
import ReadingViewContent from "@/components/reading-view/ReadingViewContent";
import ReadingViewFooter from "@/components/reading-view/ReadingViewFooter";
import ReadingViewHeader from "@/components/reading-view/ReadingViewHeader";
import { getArticleById } from "@/data/Article";

const ReadingView = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  if (!id) {
    // Redirect to home if no ID provided
    navigate('/');
    return null;
  }

  const article = getArticleById(id);

  if (!article) {
    // Article not found - could show error or redirect
    return (
      <main className="flex flex-col min-h-[calc(100vh-64px)] bg-background items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-semibold mb-2">Article not found</h1>
          <p className="text-muted-foreground mb-4">The article you're looking for doesn't exist.</p>
          <button
            onClick={() => navigate('/')}
            className="text-primary hover:underline"
          >
            Go back home
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="flex flex-col min-h-[calc(100vh-64px)] bg-background">
      {/* Reading View Header - Sticky */}
      <ReadingViewHeader
        title={article.title}
        source={article.source.name}
        readingTime={article.readingTimeInMinutes}
      />

      {/* Reading Content - Scrollable */}
      <div className="flex-1 overflow-y-auto">
        <ReadingViewContent content={article.fullContent} />
      </div>

      {/* Reading View Footer - Sticky */}
      <ReadingViewFooter articleId={article.id} />
    </main>
  );
};

export default ReadingView;
