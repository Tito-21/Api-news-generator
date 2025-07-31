# Api-news-generator

## External API Used
News data provided by NewsAPI — a flexible and widely used RESTful API for live news articles worldwide.

## Features
Fetches real-time news headlines filtered by:

- **Country**: USA, UK, Nigeria, France, Germany
- **Category**: Business, Technology, Sports, Health, Science
- **Keyword search**: Search for specific news topics or terms

Responsive grid layout displaying images, headlines, descriptions, and links to full articles

Dark/Light theme toggle for better user experience

Graceful error handling and friendly messages when no results are found or API errors occur

Interactive UI elements to provide meaningful filtering and searching

## Local Setup Instructions

1. Clone or download the repository:
```bash
git clone <repository-url>
cd Api-news-generator
```

2. **For local file access**: Open `index.html` directly in a modern browser (may have CORS limitations)

3. **For local server (recommended)**:
```bash
# Using Python
python3 -m http.server 3000
# Then visit http://localhost:3000

# Or using Node.js
npx http-server -p 3000
```

4. Use the filter controls and search input to fetch and browse news articles dynamically.

## Docker Image Details

**Docker Hub Repository**: https://hub.docker.com/repository/docker/tito274/news-aggregator

**Image Name**: `tito274/news-aggregator`

**Available Tags**: 
- `v1` - Initial version
- `v1.1` - Latest version with improved error handling
- `latest` - Points to v1.1

## Build Instructions

To build the image locally:
```bash
# Navigate to project directory
cd /path/to/Api-news-generator

# Build the Docker image
docker build -t tito274/news-aggregator:v1.1 .

# Test locally
docker run -p 8080:8080 tito274/news-aggregator:v1.1

# Verify it works
curl http://localhost:8080
```

## Deployment Instructions

### Step 1: Deploy on Web01 and Web02

SSH into each server and run:

```bash
# Pull the latest image
docker pull tito274/news-aggregator:v1.1

# Run the container
docker run -d --name news-aggregator --restart unless-stopped -p 8080:8080 tito274/news-aggregator:v1.1

# Verify the container is running
docker ps

# Test the application
curl http://localhost:8080
```

### Step 2: Configure Load Balancer (Lb01)

Edit the HAProxy configuration file:
```bash
# Access the load balancer container
docker exec -it lb-01 sh

# Edit the configuration
vi /etc/haproxy/haproxy.cfg
```

Add/update the backend configuration:
```plaintext
frontend web_frontend
    bind *:80
    default_backend webapps

backend webapps
    balance roundrobin
    option httpchk GET /
    server web01 172.20.0.11:8080 check
    server web02 172.20.0.12:8080 check
```

### Step 3: Reload HAProxy
```bash
# Reload HAProxy configuration
docker exec -it lb-01 sh -c 'haproxy -sf $(pidof haproxy) -f /etc/haproxy/haproxy.cfg'

# Or restart the container
docker restart lb-01
```

## Testing Steps & Evidence

### 1. Individual Server Testing
```bash
# Test Web01 directly
curl http://web01:8080

# Test Web02 directly
curl http://web02:8080
```

### 2. Load Balancer Testing
```bash
# Make multiple requests to see round-robin in action
for i in {1..10}; do
  curl -s http://localhost | grep -o '<title>.*</title>' && echo " - Request $i"
  sleep 1
done
```

### 3. Check HAProxy Stats (if enabled)
```bash
# Access HAProxy stats page
curl http://localhost:8080/haproxy?stats
```

### 4. Monitor Container Logs
```bash
# Monitor Web01 logs
docker logs -f news-aggregator

# Monitor Web02 logs (run on Web02)
docker logs -f news-aggregator

# Monitor Load Balancer logs
docker logs -f lb-01
```

### Evidence Collection
1. **Screenshots**: Capture the application running through the load balancer URL
2. **Logs**: Save Docker container logs showing requests being handled
3. **HAProxy Stats**: Screenshot of load balancer statistics showing traffic distribution
4. **Network Tests**: Record curl command outputs showing alternating responses

## Security Hardening

### API Key Management
Instead of hardcoding API keys, use environment variables:

1. **Create a secure config script**:
```javascript
// config-template.js
window.API_KEY = process.env.NEWS_API_KEY || "{{NEWS_API_KEY}}";
```

2. **Use Docker environment variables**:
```bash
docker run -d --name news-aggregator \
  -e NEWS_API_KEY="your-actual-api-key" \
  -p 8080:8080 \
  tito274/news-aggregator:v1.1
```

3. **Use Docker secrets** (for production):
```bash
# Create a secret
echo "your-api-key" | docker secret create news_api_key -

# Use in docker-compose or swarm
docker service create \
  --name news-aggregator \
  --secret news_api_key \
  -p 8080:8080 \
  tito274/news-aggregator:v1.1
```

### Additional Security Measures
- Use HTTPS in production
- Implement rate limiting
- Set up proper firewall rules
- Use non-root user in Docker container
- Regularly update base images

## Credits
News articles powered by [NewsAPI](https://newsapi.org/)
# Demo video
https://youtu.be/JxgOb2CGxeU