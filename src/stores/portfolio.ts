import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { Portfolio, Project, Experience, Skill } from '../types/portfolio'

const defaultPortfolio: Portfolio = {
  name: 'Your Name', title: 'Full Stack Developer', bio: 'Passionate developer...',
  location: 'Hong Kong', email: 'hello@example.com', projects: [], experience: [], skills: [], socials: [], template: 'minimal'
}

export const usePortfolioStore = defineStore('portfolio', () => {
  const portfolio = ref<Portfolio>({ ...defaultPortfolio })
  const isDirty = ref(false)

  const updateField = <K extends keyof Portfolio>(field: K, value: Portfolio[K]) => {
    portfolio.value[field] = value
    isDirty.value = true
    saveToLocalStorage()
  }

  const addProject = (project: Project) => { portfolio.value.projects.push(project); isDirty.value = true; saveToLocalStorage() }
  const updateProject = (id: string, data: Partial<Project>) => {
    const i = portfolio.value.projects.findIndex(p => p.id === id)
    if (i !== -1) { portfolio.value.projects[i] = { ...portfolio.value.projects[i], ...data }; isDirty.value = true; saveToLocalStorage() }
  }
  const removeProject = (id: string) => { portfolio.value.projects = portfolio.value.projects.filter(p => p.id !== id); isDirty.value = true; saveToLocalStorage() }

  const addExperience = (exp: Experience) => { portfolio.value.experience.push(exp); isDirty.value = true; saveToLocalStorage() }
  const updateExperience = (id: string, data: Partial<Experience>) => {
    const i = portfolio.value.experience.findIndex(e => e.id === id)
    if (i !== -1) { portfolio.value.experience[i] = { ...portfolio.value.experience[i], ...data }; isDirty.value = true; saveToLocalStorage() }
  }
  const removeExperience = (id: string) => { portfolio.value.experience = portfolio.value.experience.filter(e => e.id !== id); isDirty.value = true; saveToLocalStorage() }

  const addSkill = (skill: Skill) => { portfolio.value.skills.push(skill); isDirty.value = true; saveToLocalStorage() }
  const removeSkill = (name: string) => { portfolio.value.skills = portfolio.value.skills.filter(s => s.name !== name); isDirty.value = true; saveToLocalStorage() }

  const setTemplate = (template: string) => { portfolio.value.template = template; isDirty.value = true; saveToLocalStorage() }

  const saveToLocalStorage = () => localStorage.setItem('portfolio-builder-data', JSON.stringify(portfolio.value))
  const loadFromLocalStorage = () => {
    const data = localStorage.getItem('portfolio-builder-data')
    if (data) { try { portfolio.value = JSON.parse(data) } catch (e) { console.error(e) } }
  }

  return { portfolio, isDirty, updateField, addProject, updateProject, removeProject, addExperience, updateExperience, removeExperience, addSkill, removeSkill, setTemplate, saveToLocalStorage, loadFromLocalStorage }
})
