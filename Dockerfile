# Static SPA image for Quave Cloud (staging wired in issue #12).
# Pattern matches blog-html: lipanski/docker-static-website + httpd.conf.
FROM lipanski/docker-static-website:latest

COPY httpd.conf .
COPY dist/ .

CMD ["/busybox-httpd", "-f", "-v", "-p", "3000", "-c", "httpd.conf"]
