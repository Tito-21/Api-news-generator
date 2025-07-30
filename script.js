const apiKey = "4094ab52846e4cab92cf1d21f66048a0";
const container = document.getElementById("newsContainer");
const themeToggle = document.getElementById("themeToggle");

async function fetchNews() {
  const country = document.getElementById("country").value;
  const category = document.getElementById("category").value;
  const keyword = document.getElementById("search").value.trim();

  let url = `https://newsapi.org/v2/top-headlines?apiKey=${apiKey}&pageSize=30`;

  if (country) url += `&country=${country}`;
  if (category) url += `&category=${category}`;
  if (keyword) url += `&q=${encodeURIComponent(keyword)}`;

  try {
    const response = await fetch(url);
    const data = await response.json();

    container.innerHTML = "";

    if (data.articles.length === 0) {
      container.innerHTML = "<p>No articles found.</p>";
      return;
    }

    data.articles.forEach(article => {
      const div = document.createElement("div");
      div.className = "article";
      div.innerHTML = `
        <img src="${article.urlToImage || 'https://via.placeholder.com/300x180'}" alt="News Image" />
        <div class="content">
          <h3>${article.title}</h3>
          <p>${article.description || ''}</p>
          <a href="${article.url}" target="_blank">Read more</a>
        </div>`;
      container.appendChild(div);
    });
  } catch (error) {
    container.innerHTML = "<p>Error fetching news.</p>";
    console.error(error);
  }
}

themeToggle.onclick = () => {
  document.body.classList.toggle("dark");
  themeToggle.textContent = document.body.classList.contains("dark") ? "☀️" : "🌙";
};

window.onload = fetchNews;
