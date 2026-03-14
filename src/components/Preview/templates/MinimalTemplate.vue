<template>
  <div id="preview-content" class="min-h-screen bg-white">
    <section class="py-16 px-8 text-center">
      <div class="w-24 h-24 mx-auto mb-6 rounded-full bg-gray-200 flex items-center justify-center text-4xl">{{ store.portfolio.avatar || '👤' }}</div>
      <h1 class="text-4xl font-bold text-gray-900 mb-2">{{ store.portfolio.name || 'Your Name' }}</h1>
      <p class="text-xl text-gray-600 mb-4">{{ store.portfolio.title || 'Your Title' }}</p>
      <p class="text-gray-500 mb-6 max-w-lg mx-auto">{{ store.portfolio.bio || 'Your bio...' }}</p>
      <div class="flex justify-center gap-4 text-sm text-gray-500">
        <span v-if="store.portfolio.location">📍 {{ store.portfolio.location }}</span>
        <span v-if="store.portfolio.email">✉️ {{ store.portfolio.email }}</span>
      </div>
    </section>

    <section v-if="store.portfolio.projects.length" class="py-12 px-8 bg-gray-50">
      <div class="max-w-4xl mx-auto">
        <h2 class="text-2xl font-bold mb-6">Projects</h2>
        <div class="grid md:grid-cols-2 gap-6">
          <div v-for="p in store.portfolio.projects" :key="p.id" class="bg-white rounded-lg p-4 shadow-sm">
            <h3 class="font-semibold mb-2">{{ p.title || 'Project' }}</h3>
            <p class="text-sm text-gray-600 mb-3">{{ p.description }}</p>
            <div class="flex flex-wrap gap-2 mb-2">
              <span v-for="t in p.tags" :key="t" class="px-2 py-1 bg-gray-100 text-xs rounded">{{ t }}</span>
            </div>
            <a v-if="p.link" :href="p.link" target="_blank" class="text-primary-600 text-sm">View →</a>
          </div>
        </div>
      </div>
    </section>

    <section v-if="store.portfolio.experience.length" class="py-12 px-8">
      <div class="max-w-2xl mx-auto">
        <h2 class="text-2xl font-bold mb-6">Experience</h2>
        <div v-for="e in store.portfolio.experience" :key="e.id" class="border-l-2 border-gray-200 pl-4 mb-4">
          <h3 class="font-semibold">{{ e.role || 'Role' }}</h3>
          <p class="text-gray-600">{{ e.company || 'Company' }}</p>
          <p class="text-sm text-gray-400">{{ e.startDate }} - {{ e.current ? 'Present' : e.endDate }}</p>
        </div>
      </div>
    </section>

    <section v-if="store.portfolio.skills.length" class="py-12 px-8 bg-gray-50">
      <div class="max-w-2xl mx-auto">
        <h2 class="text-2xl font-bold mb-4">Skills</h2>
        <div class="flex flex-wrap gap-2">
          <span v-for="s in store.portfolio.skills" :key="s.name" class="px-3 py-1 border text-sm rounded-full">{{ s.name }}</span>
        </div>
      </div>
    </section>

    <section class="py-12 px-8 text-center">
      <h2 class="text-2xl font-bold mb-4">Get In Touch</h2>
      <a :href="`mailto:${store.portfolio.email}`" class="inline-block px-6 py-3 bg-gray-900 text-white rounded-lg">Contact Me</a>
    </section>
  </div>
</template>
<script setup lang="ts">
import { usePortfolioStore } from '../../../stores/portfolio'
const store = usePortfolioStore()
</script>
