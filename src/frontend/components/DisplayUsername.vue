<template>
    <p>@{{ props.username }}</p>
</template>

<script>
/*
    DisplayUsername: 
        - displays a post's user's username as @ + username
        - props: username - the username to be displayed
        - Future Features: p tag links to the post's user's profile page
*/
export default {
    name: DisplayUsername,
    props: ['username']
}
</script>

<style scoped>
    p {
        font-size: 3em;
    }
</style>