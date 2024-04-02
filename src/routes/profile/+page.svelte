<script>
    import { page } from "$app/stores";
</script>
<div>
    {#if $page.data.session}
        <div class="flex flex-col border border-slate-400">
            {#if $page.data.session.user?.image}
            <div class="flex p-2 border-b border-slate-400">
                <div class="w-48 border-r border-slate-400">
                    <h2>Profile Image</h2>
                </div>
                <div class="w-full pl-2">
                    <img
                    src={$page.data.session.user.image}
                    class="avatar w-24"
                    alt="User Avatar"
                    />
                </div>
            </div>
            {/if}
            <div class="flex p-2">
                <div class="w-48 border-r border-slate-400">
                    <h2>Profile Details</h2>
                </div>
                <div class="w-full pl-2">
                    <strong>{$page.data.session.user?.name ?? "User"}</strong>
                </div>
            </div>
        </div>
    {:else}
        <div class="flex flex-col border border-slate-400">
            <div class="flex p-2">
                <div class="w-48 border-r border-slate-400">
                    <h2>Profile Details</h2>
                </div>
                <div class="w-full pl-2">
                    <strong>Not Logged In</strong>
                </div>
            </div>
        </div>
    {/if}
</div>
