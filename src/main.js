import Vue from 'vue'
import App from './App.vue'
import Toast from 'vue-toastification'
import VModal from 'vue-js-modal'

import 'bootstrap'
import 'typeface-inter'
import 'bootstrap/scss/bootstrap.scss'
import 'remixicon/fonts/remixicon.css'
import 'leaflet/dist/leaflet.css'
import 'vue-toastification/dist/index.css';

Vue.use(VModal, {dynamic: true, draggable: true, resizable: true})
Vue.use(Toast, {
    transition: 'Vue-Toastification__slideBlurred',
    maxToasts: 3,
    newestOnTop: true,
    position: "bottom-right",
    timeout: 145000,
    closeOnClick: true,
    pauseOnFocusLoss: true,
    pauseOnHover: true,
    draggable: true,
    draggablePercent: 0.5,
    showCloseButtonOnHover: false,
    hideProgressBar: false,
    closeButton: false,
    icon: "ri-map-pin-2-line",
    rtl: false
});

Vue.config.productionTip = false
new Vue({
    render: h => h(App)
}).$mount('#app')