<template>
  <div
    class="h-screen bg-white overflow-hidden px-10 py-16 md:white flex justify-center items-center flex-col"
  >
    <div class="rounded-md shadow-md w-full md:w-1/4 overflow-hidden">
      <div class="h-2/3 p-5">
        <div class="flex items-end justify-start mb-5">
          <img src="@/assets/Logo.png" class="w-3/6 md:w-5/12 text-center" />
        </div>
        <h1 class="text-primary font-bold text-2xl mt-32">
          Books are fun with Orunla
        </h1>
        <p class="mt-3">
          There's no better way to read than with Orunla. Getting started is
          simple.
        </p>
      </div>
      <div class="bg-primary bg-opacity-5 w-full p-5 h-1/3">
        <router-link to="/auth/register">
          <el-button class="w-full" type="primary">Register account</el-button>
        </router-link>
        <div class="flex justify-center my-2">
          <div class="divider uppercase">or</div>
        </div>
        <router-link to="/auth/login">
          <el-button class="w-full" plain>Log In</el-button>
        </router-link>
      </div>
    </div>
    <p class="mt-5 text-gray-400 text-xs">
      &copy; Orunla Africa, {{ new Date().getFullYear() }}
    </p>
  </div>
</template>
<style scoped>
.divider {
  position: relative;
  color: #64748b;
  font-size: 10px;
}

.divider::before {
  content: "";
  background-color: #cbd5e1;
  height: 1px;
  width: 30px;
  position: absolute;
  left: -40px;
  top: 50%;
}
.divider::after {
  content: "";
  background-color: #cbd5e1;
  height: 1px;
  width: 30px;
  position: absolute;
  right: -40px;
  top: 50%;
}
</style>
