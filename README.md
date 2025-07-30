# Api-news-generator

# External API Used
# News data provided by NewsAPI — a flexible and widely used RESTful API for live news articles worldwide.

# Features
# Fetches real-time news headlines filtered by:

# Country: USA, UK, Nigeria, France, Germany

# Category: Business, Technology, Sports, Health, Science

# Keyword search: Search for specific news topics or terms

# Responsive grid layout displaying images, headlines, descriptions, and links to full articles

# Dark/Light theme toggle for better user experience

# Graceful error handling and friendly messages when no results are found or API errors occur

# Interactive UI elements to provide meaningful filtering and searching

# Local Setup Instructions
# Clone or download the repository.

# Open index.html in a modern browser or serve it via a simple HTTP server.

# Use the filter controls and search input to fetch and browse news articles dynamically.

# Deployment (Docker + Load Balancer)
# The application is containerized using Docker for easy deployment.

# Docker image tagged as: <tito274>/news-aggregator:v1

# Deployed on two web servers (Web01 and Web02) with a load balancer (Lb01) configured for round-robin traffic distribution.

# Load balancer ensures high availability and scalability by balancing incoming requests between the two server instances.

# How to Test Load Balancing
# Make repeated requests to the load balancer endpoint (e.g., curl http://localhost).

# Confirm that requests are alternately served from Web01 and Web02.

# Capture logs or screenshots for evidence of load distribution.

# Credits
News articles powered by NewsAPI