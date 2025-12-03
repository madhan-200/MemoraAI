"""Web search functionality using Tavily AI."""
from tavily import TavilyClient
from config import settings


class WebSearch:
    """Web search using Tavily AI API."""
    
    def __init__(self):
        """Initialize Tavily client."""
        if not settings.tavily_api_key:
            print("Warning: TAVILY_API_KEY not set. Web search will be disabled.")
            self.client = None
        else:
            self.client = TavilyClient(api_key=settings.tavily_api_key)
    
    def search(self, query: str, max_results: int = 5) -> str:
        """
        Search the web for information.
        
        Args:
            query: Search query
            max_results: Maximum number of results to return
            
        Returns:
            Formatted search results as a string
        """
        if not self.client:
            return "Web search is not available (API key not configured)."
        
        try:
            # Perform search
            response = self.client.search(
                query=query,
                max_results=max_results,
                search_depth="basic"
            )
            
            # Format results
            if not response.get("results"):
                return f"No results found for: {query}"
            
            formatted_results = [f"Search results for: {query}\n"]
            
            for i, result in enumerate(response["results"][:max_results], 1):
                title = result.get("title", "No title")
                content = result.get("content", "No content")
                url = result.get("url", "")
                
                formatted_results.append(
                    f"{i}. {title}\n"
                    f"   {content}\n"
                    f"   Source: {url}\n"
                )
            
            return "\n".join(formatted_results)
            
        except Exception as e:
            return f"Error performing web search: {str(e)}"


# Global web search instance
web_search = WebSearch()
