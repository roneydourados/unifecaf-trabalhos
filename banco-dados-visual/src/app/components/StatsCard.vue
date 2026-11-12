<script setup lang="ts">
defineProps<{
  title: string
  value: string | number
  description?: string
  icon: string
  color?: 'primary' | 'info' | 'warning' | 'success' | 'error' | 'neutral'
}>()
</script>

<template>
  <UCard>
    <div class="flex items-start justify-between gap-3">
      <div>
        <p class="text-sm text-muted">
          {{ title }}
        </p>
        <p class="mt-1 text-2xl font-semibold text-highlighted">
          {{ value }}
        </p>
        <p
          v-if="description"
          class="mt-1 text-xs text-muted"
        >
          {{ description }}
        </p>
      </div>
      <div
        class="flex size-10 items-center justify-center rounded-lg"
        :class="{
          'bg-primary/10 text-primary': !color || color === 'primary',
          'bg-info/10 text-info': color === 'info',
          'bg-warning/10 text-warning': color === 'warning',
          'bg-success/10 text-success': color === 'success',
          'bg-error/10 text-error': color === 'error',
          'bg-muted text-muted': color === 'neutral'
        }"
      >
        <UIcon
          :name="icon"
          class="size-5"
        />
      </div>
    </div>
  </UCard>
</template>
