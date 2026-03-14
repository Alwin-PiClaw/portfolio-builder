<template>
  <v-app-bar flat class="px-3" height="64">
    <v-app-bar-title class="d-flex align-center">
      <v-icon icon="mdi-palette" class="mr-2" color="primary" size="large" />
      <span class="text-h6 font-weight-bold">{{ $t('app.title') }}</span>
      <v-chip v-if="store.isDirty" size="x-small" color="warning" class="ml-2" variant="flat">●</v-chip>
    </v-app-bar-title>

    <v-spacer />

    <v-menu>
      <template v-slot:activator="{ props }">
        <v-btn v-bind="props" variant="outlined" density="compact" class="mr-3" rounded="lg" size="small">
          {{ locale === 'zh' ? '中文' : 'EN' }}
          <v-icon icon="mdi-chevron-down" end />
        </v-btn>
      </template>
      <v-list>
        <v-list-item :active="locale === 'en'" @click="locale = 'en'" value="en">EN</v-list-item>
        <v-list-item :active="locale === 'zh'" @click="locale = 'zh'" value="zh">中文</v-list-item>
      </v-list>
    </v-menu>

    <v-btn variant="tonal" color="primary" class="mr-2" @click="$emit('open-templates')">
      <v-icon icon="mdi-format-paint" class="mr-1" />
      {{ $t('app.templates') }}
    </v-btn>

    <v-btn variant="tonal" class="mr-2" @click="$emit('export-json')">
      <v-icon icon="mdi-export" class="mr-1" />
      {{ $t('app.export') }}
    </v-btn>

    <v-btn variant="flat" color="primary" @click="$emit('export-pdf')">
      <v-icon icon="mdi-file-pdf-box" class="mr-1" />
      {{ $t('app.pdf') }}
    </v-btn>
  </v-app-bar>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { usePortfolioStore } from '../stores/portfolio'

defineEmits<{
  'open-templates': []
  'export-json': []
  'export-pdf': []
}>()

const { locale } = useI18n()
const store = usePortfolioStore()
</script>
