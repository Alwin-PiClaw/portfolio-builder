<template>
  <v-card class="mb-3">
    <v-card-item class="">
      <template v-slot:prepend>
        <v-avatar color="primary" variant="tonal" size="40">
          <v-icon icon="mdi-account" />
        </v-avatar>
      </template>
      <v-card-title class="text-body-2 font-weight-bold pa-0">{{ $t('editor.basicInfo') }}</v-card-title>
    </v-card-item>
    <v-card-text class="d-flex flex-column ga-3">
      <v-text-field v-model="store.portfolio.name" :label="$t('editor.name')" variant="outlined" density="default"
        hide-details prepend-inner-icon="mdi-account" @update:model-value="onSave" />
      <v-text-field v-model="store.portfolio.title" :label="$t('editor.title')" variant="outlined" density="default"
        hide-details prepend-inner-icon="mdi-briefcase" @update:model-value="onSave" />
      <v-textarea v-model="store.portfolio.bio" :label="$t('editor.bio')" variant="outlined" density="default"
        hide-details rows="2" prepend-inner-icon="mdi-text" @update:model-value="onSave" />
      <v-text-field v-model="store.portfolio.location" :label="$t('editor.location')" variant="outlined"
        density="default" hide-details prepend-inner-icon="mdi-map-marker" @update:model-value="onSave" />
      <v-text-field v-model="store.portfolio.email" :label="$t('editor.email')" variant="outlined" density="default"
        hide-details prepend-inner-icon="mdi-email" @update:model-value="onSave" />
    </v-card-text>
  </v-card>
</template>

<script setup lang="ts">
import { usePortfolioStore } from '../../stores/portfolio'

const store = usePortfolioStore()
const onSave = () => store.saveToLocalStorage()
</script>
