<script lang="ts">
    import "../app.css";
    import { page } from '$app/stores';  

    const links = [
        {
            name: 'Home',
            href: '/'
        },
        {
            name: 'Dashboard',
            href: '/dashboard'
        }
    ];
</script>

<div>
    <nav>
        <ul class="flex">
            {#each links as link}
                <li class={`${$page.url.pathname === link.href ? "border-b-2 border-slate-600" : ""}`}>
                    <a class="block py-2 px-2" href={link.href}>{link.name}</a>
                </li>
            {/each}
        </ul>
    </nav>
    <div class="container m-auto pt-4">
        <slot>
        </slot>
    </div>
</div>


