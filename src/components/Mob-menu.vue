<template lang="pug">
div
    .hamber(:class="{'show' : showMenu}" @click="showMenu = !showMenu")
    nav#mobile-menu(:class="{'show' : showMenu}")
        ul
            li 
                router-link(to="/tech" @click="showMenu = false") Revolutionary Technologies
            li 
                router-link(to="/battery" @click="showMenu = false") Hydrogen Battery
            li
                router-link(to="/carbon" @click="showMenu = false") The Carbon Alliance
            li 
                router-link(to="/news" @click="showMenu = false") News & Insights
            li
                router-link(to="/about" @click="showMenu = false") About Us
            li 
                router-link(to="/contact" @click="showMenu = false") Contact Us
</template>

<script setup>
import { useRoute, useRouter } from 'vue-router';
import { ref, watch } from 'vue';

const router = useRouter();
const route = useRoute();

let showMenu = ref(false);

watch(showMenu, (v) => {
    if (v) {
        document.querySelector('body').style.overflow = 'hidden';
    } else {
        document.querySelector('body').style.overflow = 'unset';
    }
})
watch(route, (o, n) => {
    if (n) {
        showMenu.value = false;
    }
})
</script>

<style scoped lang="less">
.dark-mode {
    .hamber {
        &::before, &::after {
            background-color: #fff;
        }
    }
}
#mobile-menu {
    position: fixed;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100vh;
    padding: 1rem;
    padding-top: 5rem;
    text-align: center;
    background-color: rgba(255,255,255,0.9);
    backdrop-filter: blur(30px);
    transition: all 0.3s;

    &.show {
       left: 0;
    }

    ul {
        padding: 0;
        margin: 0;

        li {
            list-style: none;
            margin-bottom: 2rem;

            &:hover {
                a {
                    font-weight: bold;
                }
            }

            a {
                text-decoration: none;
                font-size: 1.2rem;
                color: #000;
            }
        }
    }
}

.hamber {
    position: fixed;
    right: 1rem;
    top: 1rem;
    width: 30px;
    height: 30px;
    cursor: pointer;
    z-index: 99;

    &::before, &::after {
        position: absolute;
        content: '';
        width: 100%;
        height: 2px;
        left: 50%;
        transform: translateX(-50%);
        background-color: #000;
        transition: all 0.3s;
    }
    &::before {
        top: 9px;
        transform-origin: 13px 21px;
    }
    &::after {
        top: 19px;
        transform-origin: 14px -20px;
    }
    &.show {
        &::before, &::after {
            background-color: #000;
        }
        &::before {
            transform: rotate(-45deg);
        }
        &::after {
            transform: rotate(45deg);
        }
    }
}

@media (max-width: 1190px) {
    .hamber, #mobile-menu {
        display: block;
    }
}
@media (min-width: 1191px) {
    .hamber, #mobile-menu {
        display: none;
    }
}
</style>