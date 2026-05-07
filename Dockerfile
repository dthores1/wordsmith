FROM node:24-slim AS frontend
WORKDIR /app
COPY app/package*.json ./
RUN npm install
COPY app/ .
# VITE_* vars are read by Vite at build time and inlined into the JS bundle.
# Pass via `fly deploy --build-arg VITE_POSTHOG_KEY=<key>`.
ARG VITE_POSTHOG_KEY
ARG VITE_POSTHOG_HOST
ENV VITE_POSTHOG_KEY=$VITE_POSTHOG_KEY
ENV VITE_POSTHOG_HOST=$VITE_POSTHOG_HOST
RUN npm run build

FROM python:3.12-slim
WORKDIR /app
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
COPY server.py .
COPY --from=frontend /app/dist ./dist
ENV PORT=8080
ENV DB_PATH=/data/wordsmith.db
EXPOSE 8080
CMD ["gunicorn", "-b", "0.0.0.0:8080", "server:app"]
