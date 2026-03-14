<template>
  <v-col cols="12" md="8" lg="9">
    <div class="pa-3 preview-scroll">
      <v-card class="preview-card overflow-hidden">
        <v-fade-transition mode="out-in">
          <component :is="currentTemplate" :key="store.portfolio.template" />
        </v-fade-transition>
      </v-card>
    </div>
  </v-col>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { usePortfolioStore } from '../stores/portfolio'
import { TEMPLATE_COMPONENTS } from '../config/templates'

const store = usePortfolioStore()

const currentTemplate = computed(
  () => TEMPLATE_COMPONENTS[store.portfolio.template] ?? TEMPLATE_COMPONENTS.minimal
)
</script>

<style scoped>
.preview-scroll {
  height: calc(100vh - 64px);
  overflow-y: auto;
}
</style>
