<template>
  <div class="preview-content min-h-screen bg-white">
    <!-- Header -->
    <v-app-bar color="blue-grey-darken-4" flat>
      <v-container class="d-flex align-center">
        <v-avatar color="blue-grey-lighten-3" size="56" class="mr-4">
          <v-icon>mdi-account</v-icon>
        </v-avatar>
        <div>
          <div class="text-h6 font-weight-bold">{{ store.portfolio.name || 'Your Name' }}</div>
          <div class="text-body-2 opacity-70">{{ store.portfolio.title }}</div>
        </div>
        <v-spacer></v-spacer>
        <div class="text-right">
          <div v-if="store.portfolio.location" class="text-body-2">
            <v-icon size="small" class="mr-1">mdi-map-marker</v-icon>{{ store.portfolio.location }}
          </div>
          <div v-if="store.portfolio.email" class="text-body-2">
            <v-icon size="small" class="mr-1">mdi-email</v-icon>{{ store.portfolio.email }}
          </div>
        </div>
      </v-container>
    </v-app-bar>

    <v-container class="py-8">
      <p class="text-body-1 mb-8" style="max-width: 800px;">{{ store.portfolio.bio || 'Your bio...' }}</p>

      <!-- Skills -->
      <div v-if="store.portfolio.skills.length" class="mb-8">
        <v-chip v-for="s in store.portfolio.skills" :key="s.name" variant="outlined" class="ma-1">{{ s.name }}</v-chip>
      </div>

      <!-- Projects -->
      <div v-if="store.portfolio.projects.length" class="mb-8">
        <v-divider class="mb-6"></v-divider>
        <h2 class="text-h4 font-weight-bold mb-6">Projects</h2>
        <v-card v-for="p in store.portfolio.projects" :key="p.id" class="mb-4" rounded="lg" elevation="1">
          <v-row no-gutters>
            <v-col cols="12" md="3" class="pa-4 bg-grey-lighten-4">
              <v-icon size="40" color="blue-grey">mdi-briefcase</v-icon>
            </v-col>
            <v-col cols="12" md="9">
              <v-card-title class="font-weight-bold">{{ p.title || 'Project' }}</v-card-title>
              <v-card-text>{{ p.description }}</v-card-text>
              <v-card-text>
                <v-chip v-for="t in p.tags" :key="t" size="small" class="mr-1">{{ t }}</v-chip>
              </v-card-text>
            </v-col>
          </v-row>
        </v-card>
      </div>
    </v-container>

    <!-- Contact -->
    <v-container fluid class="py-8 text-center bg-grey-lighten-4">
      <h2 class="text-h4 font-weight-bold mb-4">Contact</h2>
      <v-btn v-if="store.portfolio.email" :href="`mailto:${store.portfolio.email}`" color="blue-grey-darken-4" size="large" rounded="lg">
        <v-icon icon="mdi-send" class="mr-2"></v-icon>Send Message
      </v-btn>
    </v-container>
  </div>
</template>

<script setup lang="ts">
import { usePortfolioStore } from '../../../stores/portfolio'
const store = usePortfolioStore()
</script>
