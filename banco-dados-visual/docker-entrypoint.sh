#!/bin/sh
# Nitro/Nuxt faz merge das variáveis no arranque usando NUXT_* / NUXT_PUBLIC_*.
# No EasyPanel você pode definir nomes curtos (SUPABASE_URL, SUPABASE_KEY);
# aqui alinhamos para o que o runtimeConfig espera.

cd /app || exit 1

for f in /app/.env /.env; do
  if [ -f "$f" ]; then
    set -a
    # shellcheck disable=SC1090
    . "$f"
    set +a
  fi
done

export NUXT_PUBLIC_SUPABASE_URL="${NUXT_PUBLIC_SUPABASE_URL:-$SUPABASE_URL}"
export NUXT_PUBLIC_SUPABASE_KEY="${NUXT_PUBLIC_SUPABASE_KEY:-$SUPABASE_KEY}"

exec su-exec node node .output/server/index.mjs
