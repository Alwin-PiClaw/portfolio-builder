<template>
  <div id="preview-content" class="preview-content bg-white" style="min-height: 100vh;">
    <!-- Hero Section -->
    <v-container fluid class="py-16 text-center bg-grey-lighten-5">
      <v-avatar size="120" color="grey-lighten-2" class="mb-4">
        <v-icon size="48">mdi-account</v-icon>
      </v-avatar>
      <h1 class="text-h3 font-weight-bold mb-2">{{ store.portfolio.name || 'Your Name' }}</h1>
      <p class="text-h6 text-grey-darken-1 mb-4">{{ store.portfolio.title || 'Your Title' }}</p>
      <p class="text-body-1 text-grey-darken-1 mb-4 mx-auto" style="max-width: 600px;">{{ store.portfolio.bio || 'Your bio...' }}</p>
      <div class="d-flex justify-center text-body-2 text-grey" style="gap: 8px;">
        <span v-if="store.portfolio.location">
          <v-icon size="small" class="mr-1">mdi-map-marker</v-icon>{{ store.portfolio.location }}
        </span>
        <span v-if="store.portfolio.email">
          <v-icon size="small" class="mr-1">mdi-email</v-icon>{{ store.portfolio.email }}
        </span>
      </div>
    </v-container>

    <!-- Projects Section -->
    <v-container v-if="store.portfolio.projects.length" fluid class="py-12">
      <v-container>
        <h2 class="text-h4 font-weight-bold mb-6 text-center">
          <v-icon class="mr-2">mdi-briefcase</v-icon>{{ $t('preview.projects') }}
        </h2>
        <v-row>
          <v-col v-for="p in store.portfolio.projects" :key="p.id" cols="12" md="6">
            <v-card rounded="lg" elevation="2" style="height: 100%">
              <v-card-item>
                <v-card-title class="font-weight-bold">{{ p.title || 'Project' }}</v-card-title>
              </v-card-item>
              <v-card-text>{{ p.description }}</v-card-text>
              <v-card-text>
                <v-chip v-for="t in p.tags" :key="t" size="small" class="mr-1 mb-1">{{ t }}</v-chip>
              </v-card-text>
              <v-card-actions v-if="p.link">
                <v-btn :href="p.link" target="_blank" variant="tonal" color="primary">
                  <v-icon icon="mdi-open-in-new" class="mr-1"></v-icon>View
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </v-container>

    <!-- Skills Section -->
    <v-container v-if="store.portfolio.skills.length" fluid class="py-12 bg-grey-lighten-5">
      <v-container>
        <h2 class="text-h4 font-weight-bold mb-6 text-center">
          <v-icon class="mr-2">mdi-cog</v-icon>{{ $t('preview.skills') }}
        </h2>
        <div class="d-flex flex-wrap justify-center ga-2">
          <v-chip v-for="s in store.portfolio.skills" :key="s.name" size="large" variant="outlined">
            {{ s.name }}
          </v-chip>
        </div>
      </v-container>
    </v-container>

    <!-- Contact Section -->
    <v-container fluid class="py-12 text-center">
      <h2 class="text-h4 font-weight-bold mb-4">
        <v-icon class="mr-2">mdi-email-outline</v-icon>{{ $t('preview.getInTouch') }}
      </h2>
      <v-btn v-if="store.portfolio.email" :href="`mailto:${store.portfolio.email}`" 
        size="x-large" color="primary" rounded="xl" elevation="4">
        <v-icon icon="mdi-send" class="mr-2"></v-icon>
        {{ $t('preview.contactMe') }}
      </v-btn>
    </v-container>

    <!-- Footer -->
    <v-footer class="bg-grey-darken-4 py-4 text-center">
      <span class="text-body-2">© {{ new Date().getFullYear() }} {{ store.portfolio.name || 'Your Name' }}</span>
    </v-footer>
  </div>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { usePortfolioStore } from '../../../stores/portfolio'

const { t } = useI18n()
const store = usePortfolioStore()
</script>
