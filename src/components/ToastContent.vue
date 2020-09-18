<template>
  <div class="container-fluid" @click="$emit('click')">
    Şu anda {{location.name}} noktasına yakınsınız. Bilgi almak için tıklayın.
  </div>
</template>
<script>

export default {
  props: ['location']
}
</script>