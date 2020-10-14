<template>
    <div id="category" v-bind:class="props.categoryName">
        <div id="category-img"  />
    </div>
</template>

<script>
/* 
    Category: 
        - boxes on the categories page, holds an image and has a specific background color based on category name
        - Props: 
            categoryName - name of category, used to determine background color
            imgSrc - holds the path to the category's icon image file
        - Future Features: @click routes to specific category page
*/
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