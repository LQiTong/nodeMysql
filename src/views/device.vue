<template>
  <div>
    <el-form :model="form" ref="form" label-width="150px" :inline="false" size="normal">
      <el-form-item label="vid">
        <el-input v-model="form.vid"></el-input>
      </el-form-item>
      <el-form-item label="token">
        <el-input v-model="form.token"></el-input>
      </el-form-item>
      <el-form-item label="device_name">
        <el-input v-model="form.deviceName"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit" icon="el-icon-plus">新增</el-button>
        <el-button icon="el-icon-cancel">取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  data() {
    return {
      form: {}
    }
  },
  methods: {
    onSubmit() {
      console.log('this.form ---> ', this.form);
      const { vid, token, deviceName } = this.form || {}
      console.log('name ---> ', this.form);
      this.$post('device/addDevice', { vid, token, deviceName }, true).then((res) => {
        console.log('res ---> ', res);
      })
    }
  },
}
</script>

<style lang="scss" scoped>
</style>