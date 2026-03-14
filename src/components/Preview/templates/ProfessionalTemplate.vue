<template>
  <div class="min-h-screen bg-white">
    <header class="bg-slate-800 text-white py-16 px-8">
      <div class="max-w-4xl mx-auto flex items-center gap-6">
        <div class="w-24 h-24 rounded-full bg-slate-700 flex items-center justify-center text-4xl">{{ store.portfolio.avatar || '👔' }}</div>
        <div>
          <h1 class="text-3xl font-bold mb-1">{{ store.portfolio.name || 'Your Name' }}</h1>
          <p class="text-slate-300 text-lg mb-2">{{ store.portfolio.title || 'Your Title' }}</p>
          <p class="text-slate-400 text-sm">{{ store.portfolio.location }} • {{ store.portfolio.email }}</p>
        </div>
      </div>
      <p class="mt-6 text-slate-300 max-w-2xl mx-auto">{{ store.portfolio.bio || 'Your bio...' }}</p>
    </header>

    <section v-if="store.portfolio.skills.length" class="bg-slate-100 py-4 px-8 border-b">
      <div class="max-w-4xl mx-auto flex flex-wrap gap-2">
        <span v-for="s in store.portfolio.skills" :key="s.name" class="px-3 py-1 bg-white border text-sm rounded">{{ s.name }}</span>
      </div>
    </section>

    <section v-if="store.portfolio.projects.length" class="py-12 px-8">
      <div class="max-w-4xl mx-auto">
        <h2 class="text-2xl font-bold mb-6 pb-2 border-b">Projects</h2>
        <div v-for="p in store.portfolio.projects" :key="p.id" class="flex gap-6 p-6 border rounded-lg mb-4">
          <div class="w-32 h-24 bg-slate-100 rounded shrink-0 flex items-center justify-center text-3xl">💼</div>
          <div>
            <h3 class="font-semibold text-lg">{{ p.title || 'Project' }}</h3>
            <p class="text-slate-600 text-sm mb-2">{{ p.description }}</p>
            <div class="flex gap-2"><span v-for="t in p.tags" :key="t" class="px-2 py-0.5 bg-slate-100 text-xs rounded">{{ t }}</span></div>
          </div>
        </div>
      </div>
    </section>

    <section v-if="store.portfolio.experience.length" class="py-12 px-8 bg-slate-50">
      <div class="max-w-4xl mx-auto">
        <h2 class="text-2xl font-bold mb-6 pb-2 border-b">Experience</h2>
        <div v-for="e in store.portfolio.experience" :key="e.id" class="flex gap-4 mb-4">
          <div class="w-32 text-sm text-slate-500 shrink-0">{{ e.startDate }} - {{ e.current ? 'Present' : e.endDate }}</div>
          <div class="border-l-2 border-slate-300 pl-4">
            <h3 class="font-semibold">{{ e.role || 'Role' }}</h3>
            <p class="text-slate-600 text-sm">{{ e.company || 'Company' }}</p>
          </div>
        </div>
      </div>
    </section>

    <section class="py-12 px-8 text-center">
      <a :href="`mailto:${store.portfolio.email}`" class="inline-block px-6 py-3 bg-slate-800 text-white rounded-lg">Send Message</a>
    </section>
  </div>
</template>
<script setup lang="ts">
import { usePortfolioStore } from '../../stores/portfolio'
const store = usePortfolioStore()
</script>
