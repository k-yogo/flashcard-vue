<script setup>
import { ref, onMounted, watch, onBeforeUnmount } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import words from '../data/words';

let route = useRoute();
let router = useRouter();

let groupIndex = ref(Number(route.params.groupIndex)); // adjust to 0-index
let wordIndex = ref(Number(route.params.wordIndex)); // adjust to 0-index
let word = ref('');
let meaning = ref('');
let wordId = ref('')
let groupId = ref('')
let type = ref(route.params.type)
let random = ref(route.params.random);
let groupLength = ref('');

function shuffle(array) {
  let currentIndex = array.length, temporaryValue, randomIndex;

  // While there remain elements to shuffle...
  while (0 !== currentIndex) {
    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;

    // And swap it with the current element.
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }

  return array;
}

const getWord = () => {
  const group = words[groupIndex.value];
  groupLength = group.length;
  console.log(`wordIndex.value: ${wordIndex.value}`);
  let wordData = null;
  if (wordIndex.value >= groupLength || wordIndex.value < 0) { // if the word index is equal to or greater than group length
    router.push('/');
  }
  if (random.value === 'r') {
    let indexArray = '';
    if (!sessionStorage.getItem('indexArray')) {  // if 'indexArray' doesn't exist in sessionStorage
      indexArray = [...Array(groupLength).keys()]; // create an array of integers from 0 to n-1
      shuffle(indexArray);
      console.log(`indexArray: ${indexArray}`);
      sessionStorage.setItem('indexArray', JSON.stringify(indexArray));  // save 'indexArray' in sessionStorage
    } else {
      indexArray = JSON.parse(sessionStorage.getItem('indexArray'));  // get 'indexArray' from sessionStorage
      console.log(`indexArray: ${indexArray}`);
    }

    const randomIndex = indexArray[wordIndex.value]
    console.log(`randomIndex: ${randomIndex}`);
    wordData = group[randomIndex];
  } else {
    wordData = group[wordIndex.value];
  }
  if (wordData) {
    wordId.value = wordData.wordId;
    word.value = wordData.word;
    meaning.value = wordData.meaning;
    groupId.value = wordData.groupId;
    console.log(group.length);
  } else {
    router.push('/');
  }
};

/*====================================================
ACCORDION
====================================================*/
const slideUp = (el, duration = 150) => {
  el.style.height = el.offsetHeight + 'px';
  el.offsetHeight;
  el.style.transitionProperty = 'height, margin, padding';
  el.style.transitionDuration = duration + 'ms';
  el.style.transitionTimingFunction = 'ease';
  el.style.overflow = 'hidden';
  el.style.height = 0;
  el.style.paddingTop = 0;
  el.style.paddingBottom = 0;
  el.style.marginTop = 0;
  el.style.marginBottom = 0;
  setTimeout(() => {
    el.style.display = 'none';
    el.style.removeProperty('height');
    el.style.removeProperty('padding-top');
    el.style.removeProperty('padding-bottom');
    el.style.removeProperty('margin-top');
    el.style.removeProperty('margin-bottom');
    el.style.removeProperty('overflow');
    el.style.removeProperty('transition-duration');
    el.style.removeProperty('transition-property');
    el.style.removeProperty('transition-timing-function');
    el.classList.remove('is-open');
  }, duration);
};

const slideDown = (el, duration = 150) => {
  el.classList.add('is-open');
  el.style.removeProperty('display');
  let display = window.getComputedStyle(el).display;
  if (display === 'none') {
    display = 'flex';
  }
  el.style.display = display;
  let height = el.offsetHeight;
  el.style.overflow = 'hidden';
  el.style.height = 0;
  el.style.paddingTop = 0;
  el.style.paddingBottom = 0;
  el.style.marginTop = 0;
  el.style.marginBottom = 0;
  el.offsetHeight;
  el.style.transitionProperty = 'height, margin, padding';
  el.style.transitionDuration = duration + 'ms';
  el.style.transitionTimingFunction = 'ease';
  el.style.height = height + 'px';
  el.style.removeProperty('padding-top');
  el.style.removeProperty('padding-bottom');
  el.style.removeProperty('margin-top');
  el.style.removeProperty('margin-bottom');
  setTimeout(() => {
    el.style.removeProperty('height');
    el.style.removeProperty('overflow');
    el.style.removeProperty('transition-duration');
    el.style.removeProperty('transition-property');
    el.style.removeProperty('transition-timing-function');
  }, duration);
};

const slideToggle = (el, duration = 150) => {
  if (window.getComputedStyle(el).display === 'none') {
    return slideDown(el, duration);
  } else {
    return slideUp(el, duration);
  }
};

onMounted(
  () => {
    getWord();

    window.addEventListener('keyup', handleKeyUp);

    // アコーディオンを全て取得
    const accordions = document.querySelectorAll('dl');
    // 取得したアコーディオンをArrayに変換(IE対策)
    const accordionsArr = Array.prototype.slice.call(accordions);

    accordionsArr.forEach(accordion => {
      // Triggerを全て取得
      const accordionTriggers = accordion.querySelectorAll('dt');
      // TriggerをArrayに変換(IE対策)
      const accordionTriggersArr = Array.prototype.slice.call(accordionTriggers);

      accordionTriggersArr.forEach(trigger => {
        // Triggerにクリックイベントを付与
        trigger.addEventListener('click', () => {
          // '.is-active'クラスを付与or削除
          trigger.classList.toggle('is-active');
          // 開閉させる要素を取得
          const content = accordion.querySelector('dd');
          // 要素を展開or閉じる
          slideToggle(content);
        });
      });
    });
  }
);

onBeforeUnmount(() => {
  window.removeEventListener('keyup', handleKeyUp);
});

const openAccordion = () => {
  // 開閉させる要素を取得
  const content = document.querySelector('dl dd');
  // 要素を展開する
  slideToggle(content);
};

const closeAccordion = () => {
  // 開閉させる要素を取得
  const content = document.querySelector('dl dd');
  // 要素を閉じる
  if (content.style.display !== 'none') {
    slideUp(content);
  }
};

const handleKeyUp = (event) => {
  switch (event.code) {
    case 'ArrowRight':
      nextWord();
      break;
    case 'ArrowLeft':
      prevWord();
      break;
    case 'ArrowDown':
      openAccordion();
      break;
    case 'ArrowUp':
      closeAccordion();
      break;
  }
};

watch(() => route.params, (newParams) => {
  groupIndex.value = Number(newParams.groupIndex); // adjust to 0-index
  wordIndex.value = Number(newParams.wordIndex); // adjust to 0-index
  type.value = newParams.type;
  random.value = newParams.random;

  getWord();

});

const nextWord = () => {
  let nextId = wordIndex.value + 1; // we add 2 because we later subtract 1 to adjust for 0-index
  console.log(type.value);
  // 開かれている<dd>要素を閉じる
  const ddElements = document.querySelectorAll('dd.is-open');
  ddElements.forEach(el => el.style.display = 'none');
  router.push(`/${type.value}/${groupIndex.value}/${nextId}/${random.value}`); // we add 1 to adjust for 1-index in the URL
};

const prevWord = () => {
  let prevId = wordIndex.value - 1; // we add 2 because we later subtract 1 to adjust for 0-index
  console.log(type.value);
  // 開かれている<dd>要素を閉じる
  const ddElements = document.querySelectorAll('dd.is-open');
  ddElements.forEach(el => el.style.display = 'none');
  router.push(`/${type.value}/${groupIndex.value}/${prevId}/${random.value}`); // we add 1 to adjust for 1-index in the URL
};


</script>

<template>
  <h2>第{{ groupId }}章（{{ wordIndex + 1 }} / {{ groupLength }}）</h2>
  <div class="flex">
    <div v-if="route.params.type === 'a'" class="dl-wrap">
      <dl>
        <dt class="word">{{ wordId }}.&nbsp;&nbsp;{{ word }}</dt>
        <dd class="meaning">{{ meaning }}</dd>
      </dl>
    </div>
    <div v-else-if="route.params.type === 'b'" class="dl-wrap">
      <dl>
        <dt class="meaning">{{ wordId }}.&nbsp;&nbsp;{{ meaning }}</dt>
        <dd class="word">{{ word }}</dd>
      </dl>
    </div>
    <div class="button-wrapper">
      <button @click="nextWord">次の単語</button>
      <button @click="prevWord">前の単語</button>

    </div>
  </div>
</template>

<style scoped>
@media screen and (min-width: 768px) {
  dt:hover {
    opacity: .7;
  }
}

h2 {
  font-size: 22px;
  margin-bottom: 6px;
}

button {
  margin-top: 0.5rem;
  cursor: pointer;
}

.dl-wrap {
  flex: 1;
}

dd {
  display: none;
}

dt {
  cursor: pointer;
  user-select: none;
  margin-bottom: 12px;
  transition: opacity .7s;
}


.word {
  font-size: 26px;
  text-decoration: underline;
  text-underline-offset: 8px;
}

.meaning {
  font-size: 22px;
}

.flex {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 5%;
}

.button-wrapper {
  text-align: right;
  display: flex;
  flex-direction: column;
}


@media screen and (max-width: 767px) {
  button {
    font-size: 18px;
  }

  .button-wrapper {
    gap: 16px;
  }
}
</style>