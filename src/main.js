import { createApp } from 'vue'
import { createPinia } from 'pinia'
import router from './router'
import App from './App.vue'
import './assets/styles/main.css'

import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import {
  faGrip,
  faUsers,
  faCalendarCheck,
  faCommentDots,
  faChartLine,
  faCreditCard,
  faFileLines,
  faGear,
  faCircleQuestion,
  faRightFromBracket,
  faMagnifyingGlass,
  faPlus,
  faChevronDown,
  faBrain,
  faStar,
} from '@fortawesome/free-solid-svg-icons'

library.add(
  faGrip, faUsers, faCalendarCheck, faCommentDots, faChartLine,
  faCreditCard, faFileLines, faGear, faCircleQuestion, faRightFromBracket,
  faMagnifyingGlass, faPlus, faChevronDown, faBrain, faStar
)

const app = createApp(App)
app.component('font-awesome-icon', FontAwesomeIcon)
app.use(createPinia())
app.use(router)
app.mount('#app')
