<script setup>
import { ref, onMounted, watch } from 'vue';
import chapters from '../data/words';

let isReverseCheckboxChecked = ref(false);
let isRandomCheckboxChecked = ref(false);

onMounted(() => {
  console.log(chapters);

  if (sessionStorage.getItem('isReverseCheckboxChecked') !== null) {
    isReverseCheckboxChecked.value = JSON.parse(sessionStorage.getItem('isReverseCheckboxChecked'));
  }
  if (sessionStorage.getItem('isRandomCheckboxChecked') !== null) {
    isRandomCheckboxChecked.value = JSON.parse(sessionStorage.getItem('isRandomCheckboxChecked'));
  }
});

watch(isReverseCheckboxChecked, (newVal) => {
  sessionStorage.setItem('isReverseCheckboxChecked', JSON.stringify(newVal));
});
watch(isRandomCheckboxChecked, (newVal) => {
  sessionStorage.setItem('isRandomCheckboxChecked', JSON.stringify(newVal));
});
</script>

<template>
  <div>
    <div class="checkbox-wrapper">
      <label>
        <input type="checkbox" v-model="isReverseCheckboxChecked" /> 意味→単語
      </label>
    </div>
    <div class="checkbox-wrapper">
      <label>
        <input type="checkbox" v-model="isRandomCheckboxChecked" /> ランダム
      </label>
    </div>
    <div class="flex">
      <p><router-link :to="`${isReverseCheckboxChecked ? 'b' : 'a'}/0/0${isRandomCheckboxChecked ? '/r' : '/n'}`">第1章</router-link></p>
      <p><router-link :to="`${isReverseCheckboxChecked ? 'b' : 'a'}/1/0${isRandomCheckboxChecked ? '/r' : '/n'}`">第2章</router-link></p>
      <p><router-link :to="`${isReverseCheckboxChecked ? 'b' : 'a'}/2/0${isRandomCheckboxChecked ? '/r' : '/n'}`">第3章</router-link></p>
      <p><router-link :to="`${isReverseCheckboxChecked ? 'b' : 'a'}/3/0${isRandomCheckboxChecked ? '/r' : '/n'}`">第4章</router-link></p>
      <p><router-link :to="`${isReverseCheckboxChecked ? 'b' : 'a'}/4/0${isRandomCheckboxChecked ? '/r' : '/n'}`">第5章</router-link></p>
      <p><router-link :to="`${isReverseCheckboxChecked ? 'b' : 'a'}/5/0${isRandomCheckboxChecked ? '/r' : '/n'}`">第6章</router-link></p>
    </div>
  </div>
</template>


<style scoped>
p {
  margin: 1rem 0;
  font-size: 20px;
}

p a {
  display: block;
}

label {
  display: block;
  font-size: 20px;
}

.checkbox-wrapper+.checkbox-wrapper {
  margin-top: 8px;
}

@media screen and (max-width: 767px) {
  .flex {
    display: flex;
    flex-wrap: wrap;
  }
  .flex p {
    width: 33.3333%;
    font-size: 24px;
    text-align: center;
  }
}
</style>
