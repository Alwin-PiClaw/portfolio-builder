<template>
  <div class="preview-content min-h-screen bg-gradient-to-br from-purple-600 to-pink-500 text-white">
    <!-- Hero -->
    <v-container fluid class="py-16 text-center">
      <v-avatar size="140" color="white" class="mb-4" style="opacity: 0.2;">
        <v-icon size="64">mdi-account</v-icon>
      </v-avatar>
      <h1 class="text-h2 font-weight-bold mb-4">{{ store.portfolio.name || 'Your Name' }}</h1>
      <p class="text-h5 mb-6 opacity-90">{{ store.portfolio.title || 'Your Title' }}</p>
      <p class="text-body-1 mb-8 mx-auto" style="max-width: 600px; opacity: 0.8;">{{ store.portfolio.bio || 'Your bio...' }}</p>
    </v-container>

    <!-- Projects -->
    <v-container v-if="store.portfolio.projects.length" fluid class="py-12" style="background: rgba(255,255,255,0.1);">
      <v-container>
        <h2 class="text-h3 font-weight-bold mb-8 text-center">Featured Projects</h2>
        <v-row>
          <v-col v-for="p in store.portfolio.projects" :key="p.id" cols="12" md="4">
            <v-card rounded="xl" class="h-100" elevation="4">
              <div class="pa-8 text-center" style="background: linear-gradient(135deg, #f8bbd9, #e1bee7);">
                <v-icon size="48" color="purple-darken-2">mdi-web</v-icon>
              </div>
              <v-card-title class="font-weight-bold">{{ p.title || 'Project' }}</v-card-title>
              <v-card-text>{{ p.description }}</v-card-text>
              <v-card-text>
                <v-chip v-for="t in p.tags" :key="t" size="small" color="purple" class="mr-1 mb-1">{{ t }}</v-chip>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </v-container>

    <!-- Skills -->
    <v-container v-if="store.portfolio.skills.length" fluid class="py-12 text-center" style="background: rgba(255,255,255,0.1);">
      <h2 class="text-h3 font-weight-bold mb-8">Skills</h2>
      <div class="d-flex flex-wrap justify-center ga-3">
        <v-chip v-for="s in store.portfolio.skills" :key="s.name" size="x-large" class="ma-1" color="white" text-color="purple-darken-2">
          {{ s.name }}
        </v-chip>
      </div>
    </v-container>

    <!-- Contact -->
    <v-container fluid class="py-16 text-center">
      <h2 class="text-h3 font-weight-bold mb-4">Let's Create!</h2>
      <p class="mb-8 opacity-80">{{ store.portfolio.email }}</p>
      <v-btn v-if="store.portfolio.email" :href="`mailto:${store.portfolio.email}`" 
        size="x-large" rounded="xl" color="white" class="text-purple-darken-2" elevation="4">
        <v-icon icon="mdi-send" class="mr-2"></v-icon>
        Get In Touch 🚀
      </v-btn>
    </v-container>
  </div>
</template>

<script setup lang="ts">
import { usePortfolioStore } from '../../../stores/portfolio'
const store = usePortfolioStore()
</script>
