<template>
  <el-card class="box" shadow="never" :style="cardStyle">
    <i class="el-icon-info" style="color:black;"></i>
    <slot></slot>
  </el-card>
</template>

<script>
export default {
  props: {
    cardStyle: {
      default: "",
    }
  },
}
</script>

<style scoped>
.box {
  color: #004085;
  background-color: #cce5ff;
  border-color: #b8daff;
  /* margin: 0 20px; */
}
</style>