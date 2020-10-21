<template>
    <div :class="name">
        <h1>{{ name }}</h1>
    </div>
</template>

<script>
export default {
    name: 'Category',
    props: ['name', 'src']
}
</script>

<style scoped>
    * {
        width: 295px;
        height: 376px;
    }
    .sports {
        background: yellow;
    }
    .feel-good {
        background: green;
    }
    .music {
        background: purple;
    }
    .gaming {
        background: red;
    }
    .photography {
        background: blue;
    }
    .food {
        background: lightgreen;
    }
</style>