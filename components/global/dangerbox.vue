<template>
  <el-card class="box" shadow="never">
    <font-awesome-icon :icon="['fas', 'exclamation-triangle']" style="color:black;"/>
    <slot></slot>
  </el-card>
</template>


<style scoped>
.box {
  color: #721c24;
  background-color: #f8d7da;
  border-color: #f5c6cb;
  /* margin: 0 20px; */
}
</style>