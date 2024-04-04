<script>
import { page } from "$app/stores";
import { signIn, signOut } from "@auth/sveltekit/client";

const links = [
    {
        name: "Home",
        href: "/"
    },
    {
        name: "Dashboard",
        href: "/dashboard"
    },
    {
        name: "Profile",
        href: "/profile"
    }
];

/**
 * Sign in the user using the GitHub provider.
 */
const signInUser = async () => {
    await signIn("github");
};

/**
 * Sign out the user.
 */
const signOutUser = async () => {
    await signOut();
};
</script>

<nav class="flex justify-between border-b border-slate-700 bg-slate-500">
    <ul class="flex">
        {#each links as link}
            <li class={`${$page.url.pathname === link.href ? "border-b-2 border-cyan-400" : "border-b-2 border-slate-500"}`}>
                <a class="block py-3 px-2 text-slate-50 hover:bg-slate-400" href={link.href}>{link.name}</a>
            </li>
        {/each}
    </ul>
    <ul class="flex">
        {#if $page.data.session}
            <li>
                <button class="block py-3 px-2 hover:bg-slate-400 text-slate-50" on:click={signOutUser}>Logout</button>
            </li>
        {:else}
            <li>
                <button class="block py-3 px-2 hover:bg-slate-400 text-slate-50" on:click={signInUser}>Login</button>
            </li>
        {/if}
    </ul>
</nav>
