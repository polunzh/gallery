import { ViteSSG } from 'vite-ssg'
import App from './App.vue'
import './styles/global.css'

const routes = [
  { path: '/', component: () => import('./pages/Home.vue') },
  { path: '/:albumId', component: () => import('./pages/Album.vue') },
]

export const createApp = ViteSSG(
  App,
  { routes },
)
