<template>
  <div class="min-h-screen bg-gradient-to-br from-rose-400 via-orange-300 to-amber-200">
    <section class="py-20 px-8 text-center">
      <div class="inline-block mb-6">
        <div class="w-40 h-40 mx-auto rounded-2xl bg-white shadow-2xl rotate-6 flex items-center justify-center text-6xl">{{ store.portfolio.avatar || '✨' }}</div>
      </div>
      <h1 class="text-5xl font-black text-gray-900 mb-3">{{ store.portfolio.name || 'Your Name' }}</h1>
      <p class="text-2xl font-medium text-gray-800 mb-4">{{ store.portfolio.title || 'Creative Designer' }}</p>
      <p class="text-lg text-gray-700 max-w-xl mx-auto mb-8">{{ store.portfolio.bio || 'Your creative bio...' }}</p>
    </section>

    <section v-if="store.portfolio.projects.length" class="py-16 px-8 bg-white/50 backdrop-blur-sm">
      <div class="max-w-5xl mx-auto">
        <h2 class="text-3xl font-bold mb-8 text-center">Selected Works</h2>
        <div class="grid md:grid-cols-2 gap-6">
          <div v-for="(p, i) in store.portfolio.projects" :key="p.id" class="bg-white rounded-2xl p-6 shadow-lg" :class="i % 2 === 0 ? 'rotate-1' : '-rotate-1'">
            <div class="h-40 bg-gradient-to-br from-rose-200 to-orange-200 rounded mb-4 flex items-center justify-center text-5xl">🎨</div>
            <h3 class="font-bold text-xl mb-2">{{ p.title || 'Project' }}</h3>
            <p class="text-gray-600 text-sm mb-4">{{ p.description }}</p>
            <div class="flex flex-wrap gap-2 mb-2">
              <span v-for="t in p.tags" :key="t" class="px-3 py-1 bg-rose-100 text-rose-700 text-xs rounded-full">{{ t }}</span>
            </div>
            <a v-if="p.link" :href="p.link" target="_blank" class="text-rose-600 font-medium">View →</a>
          </div>
        </div>
      </div>
    </section>

    <section v-if="store.portfolio.skills.length" class="py-16 px-8 bg-white/50 text-center">
      <h2 class="text-3xl font-bold mb-8">Skills & Tools</h2>
      <div class="flex flex-wrap justify-center gap-3">
        <span v-for="s in store.portfolio.skills" :key="s.name" class="px-6 py-3 bg-white text-gray-800 rounded-full font-medium shadow-md">{{ s.name }}</span>
      </div>
    </section>

    <section class="py-20 px-8 text-center">
      <h2 class="text-4xl font-black text-gray-900 mb-4">Let's Create Together!</h2>
      <p class="text-lg text-gray-700 mb-8">Have a project in mind?</p>
      <a :href="`mailto:${store.portfolio.email}`" class="inline-block px-10 py-4 bg-gray-900 text-white font-bold rounded-full shadow-xl">Get In Touch 💌</a>
    </section>
  </div>
</template>
<script setup lang="ts">
import { usePortfolioStore } from '../../../stores/portfolio'
const store = usePortfolioStore()
</script>
