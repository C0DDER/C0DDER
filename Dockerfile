    # Use a lightweight Nginx image as the base
FROM nginx:alpine

    # Copy your HTML files into the Nginx web root directory
COPY . /usr/share/nginx/html/

    # Expose port 80, which Nginx listens on by default
EXPOSE 80
