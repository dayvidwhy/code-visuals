<script lang="ts">
    import "../app.css";
    import { page } from '$app/stores';
    import { signIn, signOut } from "@auth/sveltekit/client"

    const links = [
        {
            name: 'Home',
            href: '/'
        },
        {
            name: 'Dashboard',
            href: '/dashboard'
        },
        {
            name: 'Profile',
            href: '/profile'
        }
    ];

    const signInUser = async () => {
        await signIn("github");
    };

    const signOutUser = async () => {
        await signOut();
    };
</script>

<div>
    <nav class="flex justify-between">
        <ul class="flex">
            {#each links as link}
                <li class={`${$page.url.pathname === link.href ? "border-b-2 border-slate-600" : ""}`}>
                    <a class="block py-2 px-2" href={link.href}>{link.name}</a>
                </li>
            {/each}
        </ul>
        <ul class="flex">
            {#if $page.data.session}
                <li>
                    <button class="block py-2 px-2" on:click={signOutUser}>Logout</button>
                </li>
            {:else}
                <li>
                    <button class="block py-2 px-2" on:click={signInUser}>Login</button>
                </li>
            {/if}
        </ul>
    </nav>
    <div class="container m-auto pt-4">
        <slot>
        </slot>
    </div>
</div>


