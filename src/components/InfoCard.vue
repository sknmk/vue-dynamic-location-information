<template>
  <div class="container-fluid">
    <div class="row py-4">
      <div class="col-12">
        <h3>{{location.name}}</h3>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  props: ['location']
}
</script>