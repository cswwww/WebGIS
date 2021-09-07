<template>
  <div class="container">
    <el-form
      :model="ruleForm"
      status-icon
      :rules="rules"
      ref="ruleForm"
      label-width="90px"
      class="demo-ruleForm loginContent"
    >
      <!-- 系统名称 -->
      <!-- <el-image
        class="sysNameIcon"
        style="width: 100%; height: 45%"
        :src="urlSysName"
      ></el-image> -->
      <!-- 图标资源 -->
      <div class="loginHeaders">
        <el-image
          class="loginIcon"
          style="width: 50px; height: 50px"
          :src="url"
        ></el-image>
      </div>
      <!-- 账户信息 -->
      <i class="el-icon-user icon-user"></i>
      <el-form-item label="账户" prop="username">
        <el-input
          type="text"
          v-model="ruleForm.username"
          autocomplete="off"
          placeholder="请输入账户名"
        >
        </el-input>
      </el-form-item>
      <!-- 密码信息 -->
      <i class="el-icon-lock icon-pass"></i>
      <el-form-item label="密码" prop="password">
        <el-input
          type="password"
          v-model="ruleForm.password"
          autocomplete="off"
          placeholder="请输入账户密码"
        ></el-input>
      </el-form-item>
      <!-- 确认密码 -->
      <i class="el-icon-lock icon-pass icon-pass2"></i>
      <el-form-item label="密码" prop="password">
        <el-input
          type="password"
          v-model="ruleForm.password"
          autocomplete="off"
          placeholder="请输入账户密码"
        ></el-input>
      </el-form-item>
      <!-- 发送验证码 -->
      <!-- 密码信息 -->
      <i class="el-icon-lock icon-pass icon-pass3"></i>
      <el-form-item label="验证码" prop="password">
        <el-input
          class="verifyCode"
          type="password"
          v-model="ruleForm.password"
          autocomplete="off"
          placeholder="请输入验证码"
        ></el-input>
        <!-- 发送验证码按钮 -->
        <el-button class="sendCodeBtn" type="success">发送验证码</el-button>
      </el-form-item>
      <!-- 按钮部分：注册&重置 -->
      <el-form-item>
        <el-button
          round
          type="primary"
          class="btnstyle"
          @click="resetForm('ruleForm')"
          >重置</el-button
        >
        <el-button
          round
          class="btnstyle"
          type="primary"
          @click="submitForm('ruleForm')"
          >提交</el-button
        >
      </el-form-item>
      <!-- 链接部分：找回密码&注册账户 -->
      <div class="link">
        <el-link type="primary" @click="findPass">忘记密码</el-link> |
        <el-link type="primary" @click="LoginAccount">已有帐户?</el-link>
      </div>
    </el-form>
  </div>
</template>
<script>
export default {
  data() {
    var validatePass = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入账户'))
      } else {
        callback()
      }
    }
    var validatePass2 = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入密码'))
      } else {
        callback()
      }
    }
    // 成员属性信息
    return {
      //图标资源
      // fits: ['fill', 'contain', 'cover', 'none', 'scale-down'],
      url: require('../../static/imgs/earth.png'),
      urlSysName: require('../../static/imgs/sysName.png'),
      //输入内容
      ruleForm: {
        username: '',
        password: '',
      },
      rules: {
        username: [{ validator: validatePass, trigger: 'blur' }],
        password: [{ validator: validatePass2, trigger: 'blur' }],
      },
    }
  },
  methods: {
    /**
     * 提交表单信息
     */
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        // valid:true or false
        if (valid) {
          //1- alert('submit!')
          //账户密码验证

          console.log(this.$data.ruleForm.username)
          console.log(this.$data.ruleForm.password)
          //2-账户密码验证通过后，提示“登陆中......”
          const loading = this.$loading({
            lock: true,
            text: '登录中......',
            spinner: 'el-icon-loading',
            background: 'rgba(0, 0, 0, 0.7)',
          })
          setTimeout(() => {
            loading.close()
            //3-提示完毕，执行页面跳转
            console.log('页面跳转')
          }, 2000)
        } else {
          // console.log('error submit!!')
          //4-提示消息：账户与密码不能为空
          this.$message.error('账户与密码不能为空！')
          return false
        }
      })
    },
    /**
     * 重置表单信息
     */
    resetForm(formName) {
      this.$refs[formName].resetFields()
    },
    /**
     *找回密码:切换页面
     */
    findPass() {},
    /**
     * 注册账户：切换页面
     */
    LoginAccount() {
      // this.$router.push({ path: '/register' })
      this.$router.push({ name: 'Login' })
      // console.log(this.$router)
      // console.log(this.$route)
    },
  },
}
</script>

<style lang="less" scoped>
.container {
  margin: 0 auto;
  width: 100%;
  height: 100%;
  background-color: #ccc;
}

.loginContent {
  -webkit-border-radius: 5px;
  border-radius: 5px;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 400px;
  padding: 55px 50px 25px 40px;
  background: #fff;
  border: 1px solid #eaeaea;
  box-shadow: 0 0 25px #cac6c6;
  //验证码输入框长度
  .verifyCode {
    position: absolute;
    left: 0;
    width: 150px;
  }
  .sendCodeBtn {
    position: absolute;
    right: 0;
    width: 120px;
  }
  // 系统名称图标
  .sysNameIcon {
    position: fixed;
    top: -55%;
    left: 0;
  }

  // 头部图标部分
  .loginHeaders {
    position: fixed;
    top: 0;
    left: 0;
    .loginIcon {
      margin-top: -100%;
      margin-left: -100%;
    }
  }

  // 中间图标样式
  .icon-user,
  .icon-pass {
    position: fixed;
    top: 66px;
    left: 55px;
  }
  .icon-pass {
    top: 129px;
  }
  .icon-pass2 {
    top: 189px;
  }
  .icon-pass3 {
    top: 249px;
  }

  // 底部按钮样式
  .btnstyle {
    margin-right: 40px;
  }

  // 尾部链接部分
  .link {
    position: fixed;
    right: 15px;
    bottom: 15px;
  }
}
</style>
