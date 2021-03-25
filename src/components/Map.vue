<template>
  <div class="container-fluid h-100">
    <div class="row h-100">
      <div class="col-12">
        <img src="https://www.piyagida.com/public/img/piya_logo_sm.png" alt="Piya Gıda Resmi Logosu" class="watermark"/>
        <h4 v-if="!location"><i class="ri-map-pin-2-line"></i> Konumunuz bulunuyor. </h4>
        <l-map ref="myMap" :center="map.center" :zoom="map.zoom" v-if="location">
          <l-tile-layer :url="map.tile" :attribution="map.attribution"></l-tile-layer>
          <l-marker :lat-lng="[location.latitude, location.longitude]">
            <l-tooltip :content="currentLocationLabel"/>
          </l-marker>
          <l-circle-marker v-for="(store, index) in stores" :key="index"
                    :lat-lng="[store.coords.latitude, store.coords.longitude]"
          @click="showCard(store)">
            <l-tooltip :content="store.name"/>
          </l-circle-marker>
        </l-map>
      </div>
    </div>
  </div>
</template>
<style>
html, body {
  height: 100%;
  font-family: "Inter", sans-serif;
}
img.watermark {
  position: absolute;
  top: 1rem;
  right: 2rem;
  z-index: 999;
  height: 5rem;
  opacity: .2;
  box-shadow: 0 14px 28px rgba(0, 0, 0, 0.25), 0 10px 10px rgba(0, 0, 0, 0.22);
  border-radius: 8px;
}
.leaflet-pane, .Vue-Toastification__toast-body, .Vue-Toastification__toast-component-body {
  font-family: "Inter", sans-serif !important;
}

.Vue-Toastification__toast {
  backdrop-filter: blur(3px);
  color: rgb(52, 127, 240) !important;
  background: rgba(255, 255, 255, .3) !important;
}
.Vue-Toastification__progress-bar {
  background: rgb(52, 143, 240) !important;
  height: 2px !important;
}
.Vue-Toastification__icon {
  font-size: 2rem
}
</style>
<script>
import moment from "moment"
import L from "leaflet"
import _ from "lodash"
import * as geolib from "geolib"
import ToastContent from "@/components/ToastContent"
import InfoCard from "@/components/InfoCard"
import {LMap, LTileLayer, LMarker, LTooltip, LCircleMarker} from 'vue2-leaflet'

export default {
  name: 'Map',
  data() {
    return {
      instance: false,
      location: false,
      pin: false,
      notificationChannel: false,
      closestIndex: false,
      map: {
        tile: 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png',
        zoom: 14,
        attribution: '&copy; Serkan Mert Kaptan'
      },
      stores: [
        {id: '9572900', name: "BİG YELLOW TAXİ CENNET", coords: {latitude: 40.988503, longitude: 28.780482}},
        {id: '9414683', name: "BOSSMAN CAFE", coords: {latitude: 40.988736, longitude: 28.780358}},
        {id: '9394844', name: "BURGER ATÖLYESİ CENNET", coords: {latitude: 40.991822, longitude: 28.779766}},
        {id: '9529993', name: "CAFE PERFETTO", coords: {latitude: 40.989546, longitude: 28.779173}},
        {id: '9338304', name: "CENNET BKM DÖNER", coords: {latitude: 40.989304, longitude: 28.780132}},
        {id: '9315778', name: "CENNET DÜRÜM SALONU", coords: {latitude: 40.987862, longitude: 28.781400}},
        {id: '9314623', name: "CİHAN KARDEŞLER BÖREK SALONU", coords: {latitude: 40.991628, longitude: 28.779218}},
        {id: '9225610', name: "CUBBA", coords: {latitude: 40.990097, longitude: 28.780050}},
        {id: '9252851', name: "DEMLİK CAFE", coords: {latitude: 40.991801, longitude: 28.779387}},
        {id: '9561777', name: "EKLER KİNG", coords: {latitude: 40.988272, longitude: 28.781329}},
        {id: '9477015', name: "ERCİYES ÇAY EVİ", coords: {latitude: 40.991150, longitude: 28.779398}},
        {id: '9466151', name: "ESPACİO CAFE", coords: {latitude: 40.990207, longitude: 28.781049}},
        {id: '9142133', name: "KELKİT DÖNER", coords: {latitude: 40.988927, longitude: 28.780257}},
        {id: '9346682', name: "KRAL KUMRU", coords: {latitude: 40.986631, longitude: 28.781454}},
        {id: '9442817', name: "LEGNO HOUSE", coords: {latitude: 40.990484, longitude: 28.779782}},
        {id: '9348510', name: "MAMMA CADDE", coords: {latitude: 40.986365, longitude: 28.781680}},
        {id: '9527318', name: "MEŞHUR SARIYER BÖREKÇİSİ", coords: {latitude: 40.991545, longitude: 28.779598}},
        {id: '9550342', name: "NAZAR CAFE", coords: {latitude: 40.991316, longitude: 28.779575}},
        {id: '9459916', name: "NEZİR USTA KEBAP", coords: {latitude: 40.991780, longitude: 28.779806}},
        {id: '9419150', name: "ORKİDE DÜRÜM", coords: {latitude: 40.988993, longitude: 28.780617}},
        {id: '9215149', name: "OSKAR CAFE(COFFEMANİA CENNET)", coords: {latitude: 40.988571, longitude: 28.780920}},
        {id: '9288980', name: "OSMANLI CAFE ", coords: {latitude: 40.988283, longitude: 28.780278}},
        {id: '9544408', name: "RED SCARLETT ", coords: {latitude: 40.987419, longitude: 28.780736}},
        {id: '9424616', name: "SEFERTASI", coords: {latitude: 40.987180, longitude: 28.780992}},
        {id: '9465925', name: "SİMİDİYE CAFE", coords: {latitude: 40.987650, longitude: 28.781078}},
        {id: '9317000', name: "SÜRMENE DÖNER", coords: {latitude: 40.992009, longitude: 28.780608}},
        {id: '9317477', name: "TADIM PİDE BÖREK", coords: {latitude: 40.989149, longitude: 28.780521}},
        {id: '9350057', name: "THE PEOPLE", coords: {latitude: 40.988756, longitude: 28.780107}},
        {id: '9390402', name: "VİVA GRANDE", coords: {latitude: 40.989765, longitude: 28.780334}},
        {id: '9047291', name: "YAĞCIOĞLU UNLU MAMÜLLERİ", coords: {latitude: 40.986574, longitude: 28.781940}},
      ],
    }
  },
  mounted() {
    this.fixMarker();
    this.refresh();
    setInterval(() => {
      this.refresh();
    }, 5000)
  },
  components: {
    LMap, LTileLayer, LMarker, LTooltip, LCircleMarker
  },
  computed: {
    currentLocationLabel: function () {
      return "Güncel konumunuz. <br/> Son yenilenme: " + moment(this.location.timestamp).format("HH:mm")
    },
    toastOptions: function () {
      return {
        component: ToastContent,
        props: {
          location: this.stores[this.closestIndex]
        },
        listeners: {
          click: () => this.showCard(this.stores[this.closestIndex]),
        }
      }
    }
  },
  methods: {
    locate() {
      if (!('geolocation' in navigator)) {
        console.error('Geolocation is not available.');
        return false;
      }
      return new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(position => {
          resolve(position);
        }, error => {
          reject(error);
        }, {
          enableHighAccuracy: true
        });
      });
    },
    refresh() {
      this.locate()
          .then(location => {
            this.location = {
              latitude: location.coords.latitude,
              longitude: location.coords.longitude,
              timestamp: location.timestamp
            };
            if (!this.map.center) {
              this.map.center = L.latLng(this.location.latitude, this.location.longitude)
            }
            this.findClosest()
          })
          .catch(reason => {
            console.error(reason)
            this.location = false
          });
    },
    fixMarker() {
      delete L.Icon.Default.prototype._getIconUrl;
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
        iconUrl: require('leaflet/dist/images/marker-icon.png'),
        shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
      });
    },
    findClosest() {
      let closest = geolib.findNearest({latitude: this.location.latitude, longitude: this.location.longitude},
          _.map(this.stores, 'coords'));
      this.closestIndex = _.findIndex(this.stores,
          function (layer) {
            return layer.coords.latitude === closest.latitude && layer.coords.longitude === closest.longitude
          })

      if (this.stores[this.closestIndex].notification !== true) {
        this.$toast(this.toastOptions);
        this.stores[this.closestIndex].notification = true
      }
    },
    showCard(location) {
      this.$modal.hideAll()
      this.$modal.show(
          InfoCard,
          {location: location},
          {draggable: true}
      )
    }
  }
}
</script>
