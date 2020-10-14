<template>
    <div id="category" v-bind:class="props.categoryName">
        <div id="category-img"  />
    </div>
</template>

<script>
export default {
    name: Category,
    props: ['categoryName', 'imgSrc'],
}
</script>

<style scoped>
    #category {
        display: flex;
        justify-content: center;
    }
    .sports {
        background-color: yellow;
    }
    .feel-good {
        background-color: green;
    }
    .music {
        background-color: purple;
    }
    .gaming {
        background-color: red;
    }
    .photagraphy {
        background-color: blue;
    }
    .food {
        background-color: green;
    }
</style>