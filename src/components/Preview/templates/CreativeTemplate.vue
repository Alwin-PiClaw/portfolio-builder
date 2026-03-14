<template>
  <div class="min-h-screen bg-gradient-to-br from-purple-600 to-pink-500 text-white">
    <section class="py-20 px-8 text-center">
      <div class="w-32 h-32 mx-auto mb-6 rounded-full bg-white/20 flex items-center justify-center text-6xl backdrop-blur-sm">{{ store.portfolio.avatar || '🎨' }}</div>
      <h1 class="text-5xl font-bold mb-4">{{ store.portfolio.name || 'Your Name' }}</h1>
      <p class="text-xl mb-6 opacity-90">{{ store.portfolio.title || 'Your Title' }}</p>
      <p class="text-lg mb-8 opacity-80 max-w-xl mx-auto">{{ store.portfolio.bio || 'Your bio...' }}</p>
    </section>

    <section v-if="store.portfolio.projects.length" class="py-16 px-8 bg-white/10">
      <div class="max-w-5xl mx-auto">
        <h2 class="text-3xl font-bold mb-8 text-center">Featured Projects</h2>
        <div class="grid md:grid-cols-3 gap-6">
          <div v-for="p in store.portfolio.projects" :key="p.id" class="bg-white rounded-xl p-5 text-gray-900">
            <h3 class="font-bold text-lg mb-2">{{ p.title || 'Project' }}</h3>
            <p class="text-sm text-gray-600 mb-3">{{ p.description }}</p>
            <div class="flex flex-wrap gap-1 mb-3">
              <span v-for="t in p.tags" :key="t" class="px-2 py-0.5 bg-purple-100 text-purple-700 text-xs rounded-full">{{ t }}</span>
            </div>
            <a v-if="p.link" :href="p.link" target="_blank" class="text-purple-600 text-sm font-medium">View →</a>
          </div>
        </div>
      </div>
    </section>

    <section v-if="store.portfolio.skills.length" class="py-16 px-8 bg-white/10">
      <div class="max-w-3xl mx-auto text-center">
        <h2 class="text-3xl font-bold mb-8">Skills</h2>
        <div class="flex flex-wrap justify-center gap-3">
          <span v-for="s in store.portfolio.skills" :key="s.name" class="px-4 py-2 bg-white text-gray-800 rounded-full font-medium">{{ s.name }}</span>
        </div>
      </div>
    </section>

    <section class="py-16 px-8 text-center">
      <h2 class="text-3xl font-bold mb-4">Let's Create!</h2>
      <a :href="`mailto:${store.portfolio.email}`" class="inline-block px-8 py-4 bg-white text-purple-600 font-bold rounded-full">Get In Touch 🚀</a>
    </section>
  </div>
</template>
<script setup lang="ts">
import { usePortfolioStore } from '../../../stores/portfolio'
const store = usePortfolioStore()
</script>
