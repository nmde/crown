<template>
    <div id="categories">
        <Category 
            v-for="category in categoryList"
            :key="category.id"
            v-bind:name="category.name"   
        />
    </div>
</template>

<script>
import Category from '../components/Category.vue';
export default {
    name: 'CategoriesPage',
    data() {
        return {
            categoryList: [
                {name: 'sports', src: '', id: 1},
                {name: 'feel-good', src: '', id: 2},
                {name: 'music', src: '', id: 3},
                {name: 'gaming', src: '', id: 4},
                {name: 'photography', src: '', id: 5},
                {name: 'food', src: '', id: 6},
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
        position: absolute;
        top: 5%;
        display: flex;
        flex-wrap: wrap;
    }
</style>