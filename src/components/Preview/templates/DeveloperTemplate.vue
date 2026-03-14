<template>
  <div class="min-h-screen bg-gray-900 text-green-400 font-mono">
    <section class="py-16 px-8">
      <div class="max-w-3xl mx-auto">
        <p class="text-green-500 mb-4">// Hello, World!</p>
        <p class="text-white mb-4"><span class="text-green-500">const</span> developer = {</p>
        <div class="pl-8 space-y-1 mb-4">
          <p><span class="text-green-400">name:</span> <span class="text-yellow-300">"{{ store.portfolio.name || 'Your Name' }}"</span>,</p>
          <p><span class="text-green-400">title:</span> <span class="text-yellow-300">"{{ store.portfolio.title || 'Developer' }}"</span>,</p>
          <p><span class="text-green-400">location:</span> <span class="text-yellow-300">"{{ store.portfolio.location || 'Earth' }}"</span>,</p>
        </div>
        <p class="text-white">};</p>
        <div class="mt-8 p-4 bg-green-900/20 rounded border border-green-800">
          <p class="text-green-300">{{ store.portfolio.bio || '// Your bio goes here...' }}</p>
        </div>
      </div>
    </section>

    <section v-if="store.portfolio.skills.length" class="py-12 px-8 bg-gray-800">
      <div class="max-w-3xl mx-auto">
        <p class="text-green-500 mb-4">// Technical Skills</p>
        <div class="grid grid-cols-2 md:grid-cols-3 gap-2">
          <div v-for="s in store.portfolio.skills" :key="s.name" class="p-2 bg-gray-900 rounded border border-green-800">
            <span class="text-green-500">▸</span> <span class="text-white">{{ s.name }}</span>
          </div>
        </div>
      </div>
    </section>

    <section v-if="store.portfolio.projects.length" class="py-12 px-8">
      <div class="max-w-3xl mx-auto">
        <p class="text-green-500 mb-4">// Projects</p>
        <div v-for="p in store.portfolio.projects" :key="p.id" class="p-4 bg-gray-800 rounded-lg border border-green-800 mb-3">
          <div class="flex justify-between mb-2">
            <h3 class="font-bold text-white">{{ p.title || 'Project' }}</h3>
            <a v-if="p.link" :href="p.link" target="_blank" class="text-green-400 text-sm">[view]</a>
          </div>
          <p class="text-gray-400 text-sm mb-2">{{ p.description }}</p>
          <div class="flex gap-2"><span v-for="t in p.tags" :key="t" class="px-2 py-0.5 bg-green-900/30 text-green-400 text-xs rounded">{{ t }}</span></div>
        </div>
      </div>
    </section>

    <section class="py-12 px-8">
      <div class="max-w-3xl mx-auto">
        <p class="text-green-500 mb-4">// Contact</p>
        <p class="text-gray-400 mb-4">// Let's build something together!</p>
        <a :href="`mailto:${store.portfolio.email}`" class="inline-block px-6 py-3 bg-green-600 text-white rounded hover:bg-green-500">sendMail("{{ store.portfolio.email }}")</a>
      </div>
    </section>
  </div>
</template>
<script setup lang="ts">
import { usePortfolioStore } from '../../../stores/portfolio'
const store = usePortfolioStore()
</script>
