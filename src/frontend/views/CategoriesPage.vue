<template>
    <div id="categories">
        <Category 
            v-for="(categoryName, imgSrc, id) in categoryList"
            v-bind:categoryName="categoryName"
            v-bind:imgSrc="imgSrc"
            v-bind:key="id"
            v-bind:class="'section'+id"
        />
    </div>
</template>

<script>
import category from '../components/Category.vue';

export default {
    name: Categories,
    data() {
        return {
            category = {categoryName, imgSrc, id},

            categoryList = [
                {categoryName: 'sports', imgSrc: '', id: 0},
                {categoryName: 'feel-good', imgSrc: '', id: 1},
                {categoryName: 'music', imgSrc: '', id: 2},
                {categoryName: 'gaming', imgSrc: '', id: 3},
                {categoryName: 'photography', imgSrc: '', id: 4},
                {categoryName: 'food', imgSrc: '', id: 5},
            ]
        }
    },
    components: {
        Category
    }
}
</script>

<style scoped>
    #categories {
        display: grid;
        grid-template-areas: 
            'section0 section1 section2'
            'section3 section4 section5'
    }
    .section0 {
        grid-area: section1;
    }
    .section1 {
        grid-area: section1;
    }
    .section2 {
        grid-area: section2;
    }
    .section3 {
        grid-area: section3;
    }
    .section4 {
        grid-area: section4;
    }
    .section5 {
        grid-area: section5;
    }
</style>