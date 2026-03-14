<template>
  <div class="preview-content bg-grey-9" style="min-height: 100vh; color: #4ade80; font-family: 'Courier New', monospace;">
    <v-container class="py-16">
      <p class="text-h6 mb-4" style="color: #22c55e;">// Hello, World!</p>
      <p class="mb-4"><span style="color: #22c55e;">const</span> developer = {</p>
      <div class="pl-8 mb-4">
        <p><span style="color: #4ade80;">name:</span> <span style="color: #fde047;">"{{ store.portfolio.name || 'Your Name' }}"</span>,</p>
        <p><span style="color: #4ade80;">title:</span> <span style="color: #fde047;">"{{ store.portfolio.title || 'Developer' }}"</span>,</p>
        <p><span style="color: #4ade80;">location:</span> <span style="color: #fde047;">"{{ store.portfolio.location || 'Earth' }}"</span>,</p>
      </div>
      <p class="mb-8">};</p>
      
      <v-card class="pa-4 mb-8" rounded="lg" style="background: rgba(34, 197, 94, 0.1); border: 1px solid #22c55e;">
        <p style="color: #86efac;">{{ store.portfolio.bio || '// Your bio goes here...' }}</p>
      </v-card>

      <div v-if="store.portfolio.skills.length" class="mb-8">
        <p class="mb-4" style="color: #22c55e;">// Technical Skills</p>
        <v-row>
          <v-col v-for="s in store.portfolio.skills" :key="s.name" cols="6" md="4">
            <v-card class="pa-3" rounded="lg" style="background: #111827; border: 1px solid #22c55e;">
              <span style="color: #22c55e;">▸</span> <span style="color: white;">{{ s.name }}</span>
            </v-card>
          </v-col>
        </v-row>
      </div>

      <div v-if="store.portfolio.projects.length" class="mb-8">
        <p class="mb-4" style="color: #22c55e;">// Projects</p>
        <v-card v-for="p in store.portfolio.projects" :key="p.id" class="pa-4 mb-3" rounded="lg" style="background: #1f2937; border: 1px solid #22c55e;">
          <div class="d-flex justify-space-between mb-2">
            <span class="font-weight-bold" style="color: white;">{{ p.title || 'Project' }}</span>
            <a v-if="p.link" :href="p.link" target="_blank" style="color: #4ade80;">[view]</a>
          </div>
          <p class="text-grey mb-2">{{ p.description }}</p>
          <div>
            <v-chip v-for="t in p.tags" :key="t" size="x-small" class="mr-1" style="background: rgba(34, 197, 94, 0.2); color: #4ade80;">{{ t }}</v-chip>
          </div>
        </v-card>
      </div>

      <div class="text-center py-8">
        <p style="color: #22c55e;">// Contact</p>
        <p class="mb-4 text-grey">// Let's build something together!</p>
        <v-btn v-if="store.portfolio.email" :href="`mailto:${store.portfolio.email}`" color="green" rounded="lg">
          sendMail("{{ store.portfolio.email }}")
        </v-btn>
      </div>
    </v-container>
  </div>
</template>

<script setup lang="ts">
import { usePortfolioStore } from '../../../stores/portfolio'
const store = usePortfolioStore()
</script>
