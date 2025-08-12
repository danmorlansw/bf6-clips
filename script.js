document.addEventListener('DOMContentLoaded', async () => {
  const clipsGrid = document.getElementById('clips-grid');
  const highlightsGrid = document.getElementById('highlights-grid');
  const buttons = document.querySelectorAll('.filter-btn');

  try {
    const response = await fetch('clips.json');
    const clips = await response.json();

    // Split into top highlights and rest
    const topClips = clips.filter(c => c.top);
    const restClips = clips.filter(c => !c.top);

    renderClips(topClips, highlightsGrid);
    renderClips(restClips, clipsGrid);

    // Filter functionality
    buttons.forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelector('.filter-btn.active').classList.remove('active');
        btn.classList.add('active');
        const filter = btn.dataset.filter;
        const cards = document.querySelectorAll('.clip-card');
        cards.forEach(card => {
          if (filter === 'all' || card.dataset.type === filter) {
            card.style.display = '';
          } else {
            card.style.display = 'none';
          }
        });
        // Reload X embeds after filtering
        if (typeof twttr !== 'undefined' && twttr.widgets) {
          twttr.widgets.load();
        }
      });
    });
  } catch (error) {
    console.error('Could not load clips.json', error);
  }
});

function renderClips(clips, container) {
  clips.forEach(clip => {
    const card = document.createElement('div');
    card.className = 'clip-card';
    card.dataset.type = clip.type;
    const title = document.createElement('h3');
    title.textContent = clip.title;
    card.appendChild(title);

    if (clip.type === 'youtube') {
      const iframe = document.createElement('iframe');
      iframe.src = `https://www.youtube-nocookie.com/embed/${clip.id}`;
      iframe.loading = 'lazy';
      iframe.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share';
      iframe.allowFullscreen = true;
      card.appendChild(iframe);
    } else if (clip.type === 'x') {
      const blockquote = document.createElement('blockquote');
      blockquote.className = 'twitter-tweet';
      const anchor = document.createElement('a');
      anchor.href = clip.url;
      blockquote.appendChild(anchor);
      card.appendChild(blockquote);
    } else if (clip.type === 'reddit') {
      const blockquote = document.createElement('blockquote');
      blockquote.className = 'reddit-card';
      const anchor = document.createElement('a');
      anchor.href = clip.url;
      anchor.textContent = clip.title;
      blockquote.appendChild(anchor);
      card.appendChild(blockquote);
    }

    container.appendChild(card);
  });
}