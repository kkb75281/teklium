<template lang="pug">
section.dark(style="padding-top: 12rem")
    .inner
        h1(v-if="currentNews" style="font-size: 2.8rem; margin-bottom: 0; word-break: break-all") {{ currentNews?.subject }}

section.white 
    .inner(style="width: 100%; height: 100vh;")
        template(v-if="currentNews")
            //- div(v-html="newsHtml")
            iframe(:src="currentNews.url" width="100%" height="100%" frameborder="0" allowfullscreen)

        template(v-else)
            Loading
    div(style="text-align:center; padding-top: 2rem;")
                button.fullButton(@click="router.push('/news')") Back
</template>

<script setup>
import { useRoute, useRouter } from 'vue-router';
import { fetching, releases } from '@/cachedNews';
import { ref, onMounted } from 'vue';
import Loading from '@/components/Loading.vue'

const router = useRouter();
const route = useRoute();

let currentNews = ref(null);
// let newsHtml = ref('');

for(let r of releases.value) {
    if(r.message_id === route.params.id) {
        currentNews.value = r;
    }
}
</script>

<style scoped lang="less">
ul {
    padding-left: 1rem;

    li {
        margin-bottom: 1.2rem;

        &:last-child {
            margin-bottom: 0;
        }
        p {
            color: #999;
            margin: 0;
        }
    }
}

iframe {
    overflow-x: hidden;
}
</style>