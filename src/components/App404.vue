<template>
<div>

  <div class="text-h3 primary--text font-weight-medium pt-6 pl-15">Ошибка 404</div>

  <div class="text-body-1 font-weight-medium grey--text text--darken-1 mt-3 ml-15">
    Страница не найдена. Проверьте правильность адреса.
  </div>

  <div class="text-body-1 font-weight-medium grey--text text--darken-1 mt-1 ml-15">
    Вы можете перейти 
    <router-link :to="{ name: 'home' }" class="text-decoration-none">на главную</router-link> 
    или  
    <router-link :to="{ name: 'seances' }" class="text-decoration-none">к выбору сеансов</router-link>
    .
  </div>

</div>
</template>