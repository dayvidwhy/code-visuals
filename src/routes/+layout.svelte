<script lang="ts">
    import "../app.css";
    import Navigation from "$lib/components/Navigation.svelte";
</script>
<div class="h-full flex flex-col">
    <Navigation />
    <div class="flex flex-1 overflow-hidden">
        <slot>
        </slot>
    </div>
</div>

