# Use official nginx image as the base
FROM nginx:alpine

# Remove the default nginx static files
RUN rm -rf /usr/share/nginx/html/*

# Copy your application files to nginx html directory
COPY . /usr/share/nginx/html

# Expose port 8080
EXPOSE 8080

# Override default nginx config to listen on port 8080 instead of 80
RUN sed -i 's/listen       80;/listen       8080;/g' /etc/nginx/conf.d/default.conf

# Start nginx (default command)
CMD ["nginx", "-g", "daemon off;"]
