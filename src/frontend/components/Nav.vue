<template>
    <div id="navbar">
        <ul id="nav-links">
            <li className="nav-link">
                <img src='{path to magnifying glass icon}'>
                Discover
            </li>
            <li className="nav-link">Categories</li>
            <li className="nav-link">Feed</li>
            <li className="nav-link">Profile</li>
        </ul>
    </div>
</template>

<script>
/*
    Nav: is displayed at the top of every page on the app, links to the different 
        pages (Discover, Categories, Feed, Profile)
*/
export default {
    name: Nav
}
</script>

<style scoped>
    #navbar {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
    }
    #nav-links {
        display: flex;
        align-items: center;
        justify-content: space-around;
    }
    .nav-link {
        text-decoration: underline;
        color: black;
    }
</style>