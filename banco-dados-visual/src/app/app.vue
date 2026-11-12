<script setup lang="ts">
useHead({
  meta: [
    { name: 'viewport', content: 'width=device-width, initial-scale=1' }
  ],
  link: [
    { rel: 'icon', href: '/favicon.ico' }
  ],
  htmlAttrs: {
    lang: 'pt-BR'
  }
})

useSeoMeta({
  title: 'ONG Vida Plena',
  description: 'Gestão de beneficiários e eventos da ONG Vida Plena',
  ogTitle: 'ONG Vida Plena',
  ogDescription: 'Gestão de beneficiários e eventos da ONG Vida Plena'
})

const route = useRoute()
const toast = useToast()

const open = ref(false)

const links = [[{
  label: 'Dashboard',
  icon: 'i-lucide-layout-dashboard',
  to: '/',
  onSelect: () => {
    open.value = false
  }
}, {
  label: 'Beneficiários',
  icon: 'i-lucide-users',
  to: '/beneficiarios',
  onSelect: () => {
    open.value = false
  }
}, {
  label: 'Eventos',
  icon: 'i-lucide-calendar-days',
  to: '/eventos',
  onSelect: () => {
    open.value = false
  }
}]]

const pageTitle = computed(() => {
  if (route.path.startsWith('/beneficiarios')) return 'Beneficiários'
  if (route.path.startsWith('/eventos')) return 'Eventos'
  return 'Dashboard'
})
</script>

<template>
  <UApp :toaster="{ position: 'top-right' }">
    <UDashboardGroup unit="rem">
      <UDashboardSidebar
        id="vida-plena"
        v-model:open="open"
        collapsible
        resizable
        class="bg-elevated/25"
        :ui="{ footer: 'lg:border-t lg:border-default' }"
      >
        <template #header="{ collapsed }">
          <NuxtLink
            to="/"
            class="flex items-center gap-2 min-w-0"
          >
            <div class="flex size-8 items-center justify-center rounded-lg bg-primary text-inverted shrink-0">
              <UIcon
                name="i-lucide-heart-handshake"
                class="size-4"
              />
            </div>
            <div
              v-if="!collapsed"
              class="min-w-0"
            >
              <p class="font-semibold text-highlighted truncate">
                ONG Vida Plena
              </p>
              <p class="text-xs text-muted truncate">
                Gestão comunitária
              </p>
            </div>
          </NuxtLink>
        </template>

        <template #default="{ collapsed }">
          <UNavigationMenu
            :collapsed="collapsed"
            :items="links"
            orientation="vertical"
          />
        </template>

        <template #footer="{ collapsed }">
          <div
            class="flex items-center gap-2 px-2 py-1 text-xs text-muted"
            :class="collapsed ? 'justify-center' : ''"
          >
            <UIcon
              name="i-lucide-database"
              class="size-4 shrink-0"
            />
            <span v-if="!collapsed">Supabase conectado</span>
          </div>
        </template>
      </UDashboardSidebar>

      <UDashboardPanel>
        <template #header>
          <UDashboardNavbar :title="pageTitle">
            <template #leading>
              <UDashboardSidebarCollapse />
            </template>

            <template #right>
              <UColorModeButton />
              <UButton
                icon="i-lucide-refresh-cw"
                color="neutral"
                variant="ghost"
                aria-label="Atualizar dados"
                @click="toast.add({ title: 'Use os botões Atualizar em cada tela', color: 'neutral' })"
              />
            </template>
          </UDashboardNavbar>
        </template>

        <template #body>
          <NuxtPage />
        </template>
      </UDashboardPanel>
    </UDashboardGroup>
  </UApp>
</template>
