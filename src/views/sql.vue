<template>
  <div>
    <el-form :model="form" ref="form" label-width="80px" :inline="false" size="normal">
      <el-form-item label="姓名">
        <el-input v-model="form.name"></el-input>
      </el-form-item>
      <el-form-item label="年龄">
        <el-input v-model="form.age"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit">新增</el-button>
        <el-button>取消</el-button>
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
      const { name, age } = this.form || {}
      console.log('name ---> ', name);
      this.$post('user/addUser', { name, age }, true).then((res) => {
        console.log('res ---> ', res);
      })
    }
  },
}
</script>

<style lang="scss" scoped>
</style>