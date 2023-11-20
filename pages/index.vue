<script setup lang="ts">
import { useDebounceFn, useIntersectionObserver, useMediaControls } from '@vueuse/core';

type ImageRendered = Record<string, boolean>

type Doubt = {
  id: string
  question: string
  answer: string
}

const doubts = ref<Doubt[]>([
  {
    id: '1',
    question: 'O que está incluso no valor da inscrição?',
    answer: 'Acesso ao CATRE e a todas as programações do evento + alimentação.'
  },
  {
    id: '2',
    question: 'O que não está incluso no valor da inscrição?',
    answer: `
            <ul>
              <li>Itens de acampamento em geral: Barraca, lona, corda, lanterna, etc</li>
              <li>Itens de cozinha: Prato, talheres, copos, etc</li>
              <li>Outros itens pessoais, como: Protetor solar, repelentes, toalhas, etc</li>
            </ul>`
  },
  {
    id: '3',
    question: 'Que tipos de roupas devo levar?',
    answer:
      'O CATRE é em uma chácara, e nessa época do ano costuma fazer muito calor, então roupa de verão não pode faltar. Mas devemos tomar certos cuidados e manter o bom senso; Meninas e mulheres não devem usar roupas curtas. <b>É extremamente importante se atentar a essa parte</b> no ambiente da piscina meninas devem usar maio com shorts e rapazes, shorts. Não será permitdo a entrada na piscina com biquine e sunga.'
  }
])

const imageRendered = ref<ImageRendered>({})

const eventDate = new Date('2024-02-09 20:00')

const video = ref()

const contactForm = reactive({
  name: '',
  message: ''
})

const { playing, currentTime } = useMediaControls(video, {
  src: '/video/intro.mp4'
})

const videoIsVisible = ref(false)

const { stop } = useIntersectionObserver(video, ([{ isIntersecting }], observerElement) => {
  videoIsVisible.value = isIntersecting
})

const play = () => {
  if (video.value) {
    video.value.scrollIntoView({ behavior: 'smooth' })
    currentTime.value = 11
    playing.value = true
  } else {
    document.querySelector('#topics')?.scrollIntoView({ behavior: 'smooth' })
  }
}

const goTo = (selector: string) => {
  document.querySelector(selector)?.scrollIntoView({ behavior: 'smooth' })
}

const completeImageRender = (key: string) => {
  imageRendered.value[key] = true
}

const imageClasses = (key: string) =>
  computed(() => [
    'transition-all',
    'duration-300',
    'blur',
    imageRendered.value[key] && 'blur-none'
  ])

const sendContact = () => {
  const link = `https://api.whatsapp.com/send?phone=556781056623&text=Opa, ${contactForm.name} aqui, ${contactForm.message}`
  const encoded = encodeURI(link)
  window.open(encoded, '_blank')
}

const openCaravanPlan = () => {
  const link = `https://api.whatsapp.com/send?phone=556781056623&text=Opa, estou interessado em levar nossa caravana, como fazemos?`
  const encoded = encodeURI(link)
  window.open(encoded, '_blank')
}

onMounted(
  useDebounceFn(() => {
    window.scrollTo({ top: 0 })
  }, 10)
)

onUnmounted(() => {
  stop()
})

watch(videoIsVisible, (value) => {
  playing.value = value
  if (currentTime.value === 0) {
    currentTime.value = 11
  }
})
</script>

<template>
  <section class="md:h-full relative" id="intro">
    <nuxt-img
      src="/img/wide.png"
      class="w-full object-cover h-screen absolute"
      :class="imageClasses('wide')"
      loading="lazy"
      :placeholder="[47, 22, 75, 5]"
      @load="completeImageRender('wide')"
    />
    <div class="container mx-auto h-full py-8">
      <div
        class="grid grid-cols-1 items-center justify-center md:grid-cols-2 min-h-full container mx-auto"
      >
        <div class="text-center z-10 h-full flex justify-center items-center">
          <nuxt-img
            src="/img/logo.png"
            class="w-full h-auto"
            :class="imageClasses('logo')"
            loading="lazy"
            placeholder
            @load="completeImageRender('logo')"
          />
        </div>
        <div class="flex items-center flex-col z-50">
          <Countdown :end="eventDate" />
          <button
            @click="play()"
            class="bg-black/40 rounded-full border-2 border-white px-12 py-5 text-lg font-semibold uppercase text-white mt-12 flex items-center gap-2 hover:bg-black/75 ease-in duration-150 hover:scale-125"
          >
            <fa-icon :icon="['fas', 'circle-play']" /> aperte o play
          </button>
        </div>
      </div>
    </div>
  </section>

  <section class="h-full bg-white hidden md:block relative" id="video">
    <div
      class="absolute inset-0 z-10 ease-in duration-300 hover:bg-black/60 group flex items-center justify-center gap-4"
    >
      <button
        @click="playing = !playing"
        class="rounded-full px-3 py-2 scale-0 ease-in group-hover:scale-100 border-2 border-white hover:bg-black/50"
      >
        <template v-if="playing">
          <fa-icon :icon="['fas', 'pause']" />
          Pausar
        </template>
        <template v-else>
          <fa-icon :icon="['fas', 'play']" />
          Play
        </template>
      </button>
      <button
        @click="
          goTo('#topics');
          playing = false
        "
        class="rounded-full px-4 py-2 scale-0 ease-in group-hover:scale-100 border-2 border-white hover:bg-black/50"
      >
        <fa-icon :icon="['fas', 'angles-right']" />
        Pular
      </button>
    </div>
    <video class="w-full object-cover h-screen absolute" ref="video"></video>
  </section>

  <section class="md:h-full bg-twine-400" id="topics">
    <div class="container mx-auto min-h-full py-8 md:py-12">
      <div class="text-center text-4xl text-twine-900 uppercase font-semibold">
        Você não pode ficar fora dessa
        <div class="text-xl font-normal">aqui você vai ter a oportunidade de:</div>
      </div>

      <div class="grid grid-cols-1 items-center md:grid-cols-3 md:mt-6">
        <div class="flex flex-col gap-2 items-center justify-center mt-8 lg:mt-12 xl:mt-16">
          <div
            class="w-32 h-32 flex items-center justify-center rounded-full bg-white p-1.5 shadow-lg"
          >
            <div
              class="w-full h-full rounded-full bg-twine-700 text-white flex items-center justify-center"
            >
              <fa-icon :icon="['fas', 'book-bible']" size="4x" />
            </div>
          </div>
          <div class="text-center text-2xl">Se aproximar de Deus</div>
        </div>

        <div class="flex flex-col gap-2 items-center justify-center mt-8 lg:mt-12 xl:mt-16">
          <div
            class="w-32 h-32 flex items-center justify-center rounded-full bg-white p-1.5 shadow-lg"
          >
            <div
              class="w-full h-full rounded-full bg-twine-700 text-white flex items-center justify-center"
            >
              <fa-icon :icon="['fas', 'people-group']" size="4x" />
            </div>
          </div>
          <div class="text-center text-2xl">Fazer novos amigos</div>
        </div>

        <div class="flex flex-col gap-2 items-center justify-center mt-8 lg:mt-12 xl:mt-16">
          <div
            class="w-32 h-32 flex items-center justify-center rounded-full bg-white p-1.5 shadow-lg"
          >
            <div
              class="w-full h-full rounded-full bg-twine-700 text-white flex items-center justify-center"
            >
              <fa-icon :icon="['fas', 'pizza-slice']" size="4x" />
            </div>
          </div>
          <div class="text-center text-2xl">Comer comidas deliciosas</div>
        </div>

        <div class="flex flex-col gap-2 items-center justify-center mt-8 lg:mt-12 xl:mt-16">
          <div
            class="w-32 h-32 flex items-center justify-center rounded-full bg-white p-1.5 shadow-lg"
          >
            <div
              class="w-full h-full rounded-full bg-twine-700 text-white flex items-center justify-center"
            >
              <fa-icon :icon="['fas', 'person-swimming']" size="4x" />
            </div>
          </div>
          <div class="text-center text-2xl">Praticar exercícios ao ar livre</div>
        </div>

        <div class="flex flex-col gap-2 items-center justify-center mt-8 lg:mt-12 xl:mt-16">
          <div
            class="w-32 h-32 flex items-center justify-center rounded-full bg-white p-1.5 shadow-lg"
          >
            <div
              class="w-full h-full rounded-full bg-twine-700 text-white flex items-center justify-center"
            >
              <fa-icon :icon="['fas', 'heart']" size="4x" />
            </div>
          </div>
          <div class="text-center text-2xl">Encontrar seu "Mozão"</div>
        </div>

        <div class="flex flex-col gap-2 items-center justify-center mt-8 lg:mt-12 xl:mt-16">
          <div
            class="w-32 h-32 flex items-center justify-center rounded-full bg-white p-1.5 shadow-lg"
          >
            <div
              class="w-full h-full rounded-full bg-twine-700 text-white flex items-center justify-center"
            >
              <fa-icon :icon="['fas', 'music']" size="4x" />
            </div>
          </div>
          <div class="text-center text-2xl">Curtir música boa</div>
        </div>
      </div>

      <div class="flex flex-col items-center justify-center pt-12 md:pt-16 lg:pt-20 xl:pt-24">
        <div class="text-twine-800 text-3xl py-2 font-medium">E ai, bora?</div>
        <button
          @click="goTo('#plans')"
          class="rounded-full border-4 border-white px-12 py-5 text-lg font-semibold uppercase text-white flex items-center gap-2 hover:bg-black/75 ease-in duration-150 hover:scale-125"
        >
          <fa-icon :icon="['far', 'face-smile-beam']" /> não posso perder
        </button>
      </div>
    </div>
  </section>

  <section class="lg:h-full bg-twine-900" id="plans">
    <div class="min-h-full py-8">
      <div class="text-center text-white text-4xl uppercase">
        Escolha uma opção e comece a contar
        <fa-icon :icon="['fas', 'hourglass-start']" />
      </div>

      <div
        class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 items-center container mx-auto p-8 gap-8"
      >
        <div
          class="bg-white rounded-lg shadow-lg p-8 flex flex-col items-center justify-center text-center text-slate-950 h-[620px]"
        >
          <div class="h-16">
            <div class="uppercase text-3xl">Criança</div>
            <div class="text-slate-500">(6 à 12 anos)</div>
          </div>

          <nuxt-img
            src="/img/kids.webp"
            class="w-auto h-full max-h-72"
            :class="imageClasses('kids')"
            loading="lazy"
            placeholder
            @load="completeImageRender('kids')"
          />

          <div class="h-28">
            <div class="flex items-baseline">
              <div class="text-xl">10x de</div>
              <div class="text-6xl text-purple-700 font-bold">14,41</div>
            </div>
            <div>ou</div>
            <div class="text-2xl font-semibold">120,00</div>
          </div>

          <a
          href="https://acamp.mycartpanda.com/products/02"
            class="bg-purple-700 uppercase font-medium text-white text-xl p-4 w-full rounded-lg mt-8"
          >
            se inscrever
          </a>
        </div>

        <div
          class="bg-white rounded-lg shadow-lg p-8 flex flex-col items-center justify-center text-center text-slate-950 h-[620px]"
        >
          <div class="h-16">
            <div class="uppercase text-3xl h-20">Adulto</div>
          </div>

          <nuxt-img
            src="/img/adult.png"
            class="w-auto h-full max-h-72"
            :class="imageClasses('kids')"
            loading="lazy"
            placeholder
            @load="completeImageRender('kids')"
          />

          <div class="h-28">
            <div class="flex items-baseline">
              <div class="text-xl">10x de</div>
              <div class="text-6xl text-purple-700 font-bold">28,82</div>
            </div>
            <div>ou</div>
            <div class="text-2xl font-semibold">240,00</div>
          </div>

          <a
          href="https://acamp.mycartpanda.com/products/01"
            class="bg-purple-700 uppercase font-medium text-white text-xl p-4 w-full rounded-lg mt-8"
          >
            se inscrever
          </a>
        </div>

        <div
          class="bg-white rounded-lg shadow-lg p-8 flex flex-col items-center justify-center text-center text-slate-950 h-[620px]"
        >
          <div class="h-16">
            <div class="uppercase text-3xl">Caravana</div>
          </div>

          <nuxt-img
            src="/img/caravan.jpeg"
            class="w-auto h-full max-h-72"
            :class="imageClasses('caravan')"
            loading="lazy"
            placeholder
            @load="completeImageRender('caravan')"
          />

          <div class="h-28 flex items-center justify-center">
            <div class="text-3xl font-medium text-purple-700">sob-consulta</div>
          </div>

          <button
          @click="openCaravanPlan()"
            class="bg-purple-700 uppercase font-medium text-white text-xl p-4 w-full rounded-lg mt-8"
          >
            Consultar
          </button>
        </div>
      </div>

      <div class="text-center text-slate-200 mt-4">
        Ficou com dúvidas?
        <a href="#" @click.prevent="goTo('#doubts')" class="text-twine-300 hover:text-twine-400"
          >clique aqui</a
        >
      </div>
    </div>
  </section>

  <section class="bg-twine-100" id="doubts">
    <div class="py-8">
      <div class="container mx-auto">
        <div class="text-center text-twine-600 text-4xl uppercase font-semibold">
          Ficou com dúvidas?
        </div>

        <div class="flex items-center justify-center flex-col gap-8 text-slate-900 text-xl mt-6">
          <div class="flex flex-col text-center gap-2" v-for="d of doubts" :key="d.id">
            <div
              class="rounded-full w-24 h-24 border-4 border-twine-600 inline-flex items-center justify-center mx-auto bg-twine-300 text-3xl text-twine-600"
            >
              {{ d.id }}
            </div>
            <strong>{{ d.question }}</strong>
            <div v-html="$sanitize(d.answer)"></div>
          </div>
        </div>

        <div class="text-center text-yellow-600 text-2xl mt-8">
          Ainda tem dúvidas?
          <div class="text-xl">Escreva para nós</div>
        </div>

        <div class="flex flex-col items-center mx-auto max-w-xl mt-4 gap-2">
          <div class="w-full">
            <input
              v-model="contactForm.name"
              type="text"
              placeholder="Seu nome"
              class="w-full rounded-lg p-4 bg-white/50 hover:bg-white focus:bg-white text-twine-800 ring-0 outline-none"
            />
          </div>
          <div class="w-full">
            <textarea
              v-model="contactForm.message"
              placeholder="sua mensagem"
              id=""
              cols="30"
              rows="6"
              class="w-full rounded-lg p-4 bg-white/50 hover:bg-white focus:bg-white text-twine-800 ring-0 outline-none"
            ></textarea>
          </div>
          <div class="ml-auto">
            <button
              @click="sendContact()"
              class="bg-twine-400 px-4 py-2 rounded inline-flex items-center gap-2 hover:bg-twine-500"
            >
              <fa-icon :icon="['far', 'paper-plane']" />Enviar
            </button>
          </div>
        </div>
      </div>
    </div>
  </section>

  <footer
    class="text-slate-300"
  >
    <div class="container mx-auto">
      <div class="items-center grid grid-cols-1 lg:grid-cols-4">
        <div>
          <nuxt-img
            src="/img/logo_dark.png"
            class="w-full h-auto"
            :class="imageClasses('logo_dark')"
            loading="lazy"
            placeholder
            @load="completeImageRender('logo_dark')"
          />
        </div>

        <div>
          <h5 class="font-semibold pb-3">Endereço</h5>
          <p>Estrada Rios, Km 3</p>
          <p>Terra Roxa, PR, 85990-000</p>
          <p class="flex gap-2">
            <fa-icon class="pt-1" :icon="['fab', 'whatsapp']" />
            <div>
              <div>(67) 98105-6623</div>
              <div>(44) 99924-0955</div>
            </div>
          </p>
        </div>

        <div>
          <h5 class="font-semibold pb-3">Links</h5>
          <nav class="flex flex-col gap-1.5">
            <nuxt-link to="#">Fazer minha inscrição</nuxt-link>
            <nuxt-link to="#">Dúvidas frequentes</nuxt-link>
            <nuxt-link to="#">Preciso de ajuda</nuxt-link>
          </nav>
        </div>

        <div>
          <div class="font-semibold py-4"></div>
          <nav class="flex flex-col gap-1.5">
            <nuxt-link to="#">Políticas de privacidade</nuxt-link>
            <nuxt-link to="#">Legal</nuxt-link>
          </nav>
        </div>
      </div>

      <div class="text-center text-sm pb-4">
          <span class="text-slate-500">&copy;{{ new Date().getFullYear() }}</span> - Todos os direitos reservados
        </div>
    </div>
  </footer>
</template>
