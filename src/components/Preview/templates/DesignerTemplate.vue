<template>
  <div class="preview-content" style="min-height: 100vh; background: linear-gradient(to bottom right, #fb7185, #fdba74, #fcd34d);">
    <!-- Hero -->
    <v-container fluid class="py-16 text-center">
      <v-card rounded="xl" elevation="8" class="d-inline-block pa-2 mx-auto" style="transform: rotate(-3deg);">
        <v-avatar size="120" color="white" class="">
          <v-icon size="56">mdi-star</v-icon>
        </v-avatar>
      </v-card>
      <h1 class="text-h2 font-weight-black mt-6 mb-2" style="color: #1f2937;">{{ store.portfolio.name || 'Your Name' }}</h1>
      <p class="text-h5 font-weight-medium mb-4" style="color: #374151;">{{ store.portfolio.title || 'Creative Designer' }}</p>
      <p class="text-body-1 mb-8 mx-auto" style="color: #4b5563; max-width: 600px;">{{ store.portfolio.bio || 'Your creative bio...' }}</p>
    </v-container>

    <!-- Projects -->
    <v-container v-if="store.portfolio.projects.length" fluid class="py-12" style="background: rgba(255,255,255,0.5);">
      <v-container>
        <h2 class="text-h3 font-weight-bold mb-8 text-center" style="color: #1f2937;">Selected Works</h2>
        <v-row>
          <v-col v-for="(p, i) in store.portfolio.projects" :key="p.id" cols="12" md="6">
            <v-card rounded="2xl" elevation="6" :style="{ height: '100%', transform: i % 2 === 0 ? 'rotate(1deg)' : 'rotate(-1deg)' }">
              <div class="pa-8 text-center" style="background: linear-gradient(135deg, #fce7f3, #fed7aa);">
                <v-icon size="56" color="rose-darken-2">mdi-palette</v-icon>
              </div>
              <v-card-title class="text-h5 font-weight-bold" style="color: #1f2937;">{{ p.title || 'Project' }}</v-card-title>
              <v-card-text style="color: #6b7280;">{{ p.description }}</v-card-text>
              <v-card-text>
                <v-chip v-for="t in p.tags" :key="t" size="small" color="rose" class="mr-1 mb-1">{{ t }}</v-chip>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </v-container>

    <!-- Skills -->
    <v-container v-if="store.portfolio.skills.length" fluid class="py-12 text-center" style="background: rgba(255,255,255,0.5);">
      <h2 class="text-h3 font-weight-bold mb-8" style="color: #1f2937;">Skills & Tools</h2>
      <div class="d-flex flex-wrap justify-center" style="gap: 12px;">
        <v-chip v-for="s in store.portfolio.skills" :key="s.name" size="x-large" class="ma-1" color="white" style="color: #1f2937; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
          {{ s.name }}
        </v-chip>
      </div>
    </v-container>

    <!-- Contact -->
    <v-container fluid class="py-16 text-center">
      <h2 class="text-h3 font-weight-black mb-4" style="color: #1f2937;">Let's Create Together!</h2>
      <p class="text-h6 mb-8" style="color: #4b5563;">Have a project in mind?</p>
      <v-btn v-if="store.portfolio.email" :href="`mailto:${store.portfolio.email}`" 
        size="x-large" rounded="full" color="grey-9" elevation="6">
        <v-icon icon="mdi-email" class="mr-2"></v-icon>Get In Touch 💌
      </v-btn>
    </v-container>
  </div>
</template>

<script setup lang="ts">
import { usePortfolioStore } from '../../../stores/portfolio'
const store = usePortfolioStore()
</script>
