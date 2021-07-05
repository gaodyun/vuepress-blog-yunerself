<template>
  <div>
    <Archive v-if="$page.path === '/archive/'"/>
    <BaseListLayout v-else-if="$pagination" />
    <Content v-else />
  </div>
</template>
