<script lang="ts">
    import "../app.css";
    import Navigation from "$lib/components/Navigation.svelte";
</script>
<div>
    <Navigation />
    <div class="container m-auto pt-4">
        <slot>
        </slot>
    </div>
</div>

