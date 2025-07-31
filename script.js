const apiKey = window.API_KEY || "your-api-key-here";
const container = document.getElementById("newsContainer");
const themeToggle = document.getElementById("themeToggle");

async function fetchNews() {
  const country = document.getElementById("country").value;
  const category = document.getElementById("category").value;
  const keyword = document.getElementById("search").value.trim();

  // Show loading message
  container.innerHTML = "<p>Loading news...</p>";

  // Check if API key is available
  if (!apiKey || apiKey === "your-api-key-here") {
    container.innerHTML = "<p>Error: API key not configured. Please check config.js file.</p>";
    return;
  }

  let url = `https://newsapi.org/v2/top-headlines?apiKey=${apiKey}&pageSize=30`;

  if (country) url += `&country=${country}`;
  if (category) url += `&category=${category}`;
  if (keyword) url += `&q=${encodeURIComponent(keyword)}`;

  console.log('Fetching from URL:', url.replace(apiKey, '[API_KEY_HIDDEN]'));

  try {
    const response = await fetch(url);
    console.log('Response status:', response.status);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('API Error Response:', errorText);
      container.innerHTML = `<p>API Error: ${response.status} - ${response.statusText}</p><p>This might be due to CORS restrictions. Try running from a web server.</p>`;
      return;
    }

    const data = await response.json();
    console.log('API Response:', data);

    container.innerHTML = "";

    if (data.status === 'error') {
      container.innerHTML = `<p>API Error: ${data.message}</p>`;
      return;
    }

    if (!data.articles || data.articles.length === 0) {
      const countryName = document.getElementById("country").selectedOptions[0].text;
      const categoryName = document.getElementById("category").selectedOptions[0].text;
      let message = `No articles found for ${countryName}`;
      if (categoryName !== "All") {
        message += ` in ${categoryName} category`;
      }
      message += ". Try selecting a different country or category.";
      container.innerHTML = `<p>${message}</p>`;
      return;
    }

    data.articles.forEach(article => {
      const div = document.createElement("div");
      div.className = "article";
      div.innerHTML = `
        <img src="${article.urlToImage || 'https://via.placeholder.com/300x180'}" alt="News Image" onerror="this.src='https://via.placeholder.com/300x180'" />
        <div class="content">
          <h3>${article.title || 'No title'}</h3>
          <p>${article.description || 'No description available'}</p>
          <a href="${article.url}" target="_blank">Read more</a>
        </div>`;
      container.appendChild(div);
    });
  } catch (error) {
    console.error('Fetch error:', error);
    container.innerHTML = `<p>Error fetching news: ${error.message}</p><p>Common causes:</p><ul><li>CORS restrictions (try running from a web server)</li><li>Network connectivity issues</li><li>Invalid API key</li></ul>`;
  }
}

themeToggle.onclick = () => {
  document.body.classList.toggle("dark");
  themeToggle.textContent = document.body.classList.contains("dark") ? "☀️" : "🌙";
};

window.onload = fetchNews;
