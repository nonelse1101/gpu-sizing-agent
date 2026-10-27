FROM python:3.12-slim

WORKDIR /app

# Create a non-root user for container security
RUN useradd --create-home --shell /bin/bash appuser

COPY index.html styles.css app.js server.py /app/
RUN chown -R appuser:appuser /app

USER appuser

ENV PORT=8080
ENV K_SERVICE=gpu-sizing-agent

EXPOSE 8080

CMD ["python3", "/app/server.py"]
