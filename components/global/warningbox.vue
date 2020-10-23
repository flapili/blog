<template>
  <el-card class="box" shadow="never">
    <i class="el-icon-warning" style="color:black;"></i>
    <slot></slot>
  </el-card>
</template>


<style scoped>
.box {
  color: #856404;
  background-color: #fff3cd;
  border-color: #ffeeba;
  /* margin: 0 20px; */
}
</style>