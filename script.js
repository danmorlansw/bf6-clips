// Fetch clips data from clips.json and build the page
document.addEventListener('DOMContentLoaded', () => {
  fetch('clips.json')
    .then((resp) => {
      if (!resp.ok) throw new Error('Failed to load clips.json');
      return resp.json();
    })
    .then((clips) => {
      const container = document.getElementById('clips');
      clips.forEach((clip) => {
        const card = document.createElement('div');
        card.className = 'clip-card';
        // Title
        const title = document.createElement('h2');
        title.textContent = clip.title || '';
        card.appendChild(title);
        // Content wrapper
        const content = document.createElement('div');
        content.className = 'clip-content';
        // Build embed based on type
        if (clip.type === 'youtube') {
          const iframe = document.createElement('iframe');
          // If id provided, build embed url; else use url directly
          const videoId = clip.id || (clip.url ? extractYouTubeID(clip.url) : '');
          iframe.src = `https://www.youtube-nocookie.com/embed/${videoId}`;
          iframe.loading = 'lazy';
          iframe.title = 'YouTube video player';
          iframe.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture';
          iframe.referrerPolicy = 'strict-origin-when-cross-origin';
          iframe.allowFullscreen = true;
          content.appendChild(iframe);
        } else if (clip.type === 'x') {
          // Build a blockquote for Twitter (X)
          const blockquote = document.createElement('blockquote');
          blockquote.className = 'twitter-tweet';
          const anchor = document.createElement('a');
          anchor.href = clip.url;
          blockquote.appendChild(anchor);
          content.appendChild(blockquote);
        } else if (clip.type === 'reddit') {
          const blockquote = document.createElement('blockquote');
          blockquote.className = 'reddit-card';
          const anchor = document.createElement('a');
          anchor.href = clip.url;
          anchor.textContent = clip.title || 'Reddit clip';
          blockquote.appendChild(anchor);
          content.appendChild(blockquote);
        }
        card.appendChild(content);
        container.appendChild(card);
      });
      // After cards added, instruct widgets to parse X embeds
      if (window.twttr && window.twttr.widgets) {
        window.twttr.widgets.load();
      }
    })
    .catch((error) => {
      console.error('Error loading clips:', error);
    });
});

// Utility to extract YouTube ID from a URL
function extractYouTubeID(url) {
  try {
    const obj = new URL(url);
    if (obj.hostname.includes('youtu.be')) {
      return obj.pathname.slice(1);
    }
    const params = obj.searchParams;
    return params.get('v');
  } catch (e) {
    return '';
  }
}
