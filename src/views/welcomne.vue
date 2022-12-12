<template>
  <div class="register">
    <el-form ref="form" :model="form" :rules="roles" class="register-form">
      <h3 class="title">请补充您的店铺信息！</h3>
      <el-form-item label="店铺名称" prop="name" required style="width:100%;">
        <el-input  v-model="form.name" type="text" auto-complete="off" style="width: 60%"/>
      </el-form-item>
      <el-form-item label="店铺图标" prop="logo">
        <file-upload ref="logo" :file-list="logofileList" :uploadFileUrl="logoAction"
                     :fileType="['jpg','png','jpeg']"
                     @input="handleUploadSuccess">
        </file-upload>
      </el-form-item>
      <el-form-item style="width:100%;">
        <el-button
          :loading="loading"
          size="medium"
          type="primary"
          style="width:100%;"
          @click.native.prevent="submit"
        >
          <span v-if="!loading">确 定</span>
          <span v-else>提 交 中...</span>
        </el-button>
      </el-form-item>
    </el-form>

  </div>
</template>

<script>
  import {createShop} from "@/api/shop";
  import store from "../store";
  import {Message} from "element-ui";

  export default {
    data() {
      return {
        form:{
          name:'',
          logo:''
        },
        roles:{
          name: [
            {required: true, trigger: "blur", message: "请输入您的店铺名称"},
            {min: 2, max: 10, message: '店铺名称长度必须介于 2 和 10 之间', trigger: 'blur'}
          ],
        },
        loading: false,
        logoAction: process.env.VUE_APP_BASE_API + '/api/common/file/upload?module=店铺&function=店铺图标上传',
        logofileList: [],
      }
    },
    methods:{
      handleUploadSuccess(res) {
        // 获取富文本组件实例
        this.form.logo = res.url
      },
      submit() {
        this.$refs.form.validate(valid => {
          if (valid) {
            this.loading = true;
            createShop(this.form).then(res => {
              store.dispatch('GetInfo').then(() => {
                this.$router.push("/");
              }).catch(err => {
                store.dispatch('LogOut').then(() => {
                  Message.error(err)
                  next({path: '/'})
                })
              })
            }).catch(() => {
              this.loading = false;
            })
          }
        });
      }
    }
  }
</script>

<style rel="stylesheet/scss" lang="scss">
  .register {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100%;
    background-size: cover;
  }

  .title {
    margin: 0px auto 30px auto;
    text-align: center;
    color: #707070;
  }

  .register-form {
    border-radius: 6px;
    background: #ffffff;
    width: 400px;
    padding: 25px 25px 5px 25px;

    .el-input {
      height: 38px;

      input {
        height: 38px;
      }
    }

    .input-icon {
      height: 39px;
      width: 14px;
      margin-left: 2px;
    }
  }

  .register-tip {
    font-size: 13px;
    text-align: center;
    color: #bfbfbf;
  }

  .register-code {
    width: 33%;
    height: 38px;
    float: right;

    img {
      cursor: pointer;
      vertical-align: middle;
    }
  }

  .el-register-footer {
    height: 40px;
    line-height: 40px;
    position: fixed;
    bottom: 0;
    width: 100%;
    text-align: center;
    color: #fff;
    font-family: Arial;
    font-size: 12px;
    letter-spacing: 1px;
  }

  .register-code-img {
    height: 38px;
  }
</style>
