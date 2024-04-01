import { SvelteKitAuth } from "@auth/sveltekit";
import GitHub from "@auth/sveltekit/providers/github";
import { GITHUB_CLIENT_ID, GITHUB_SECRET } from "$env/static/private";
console.log(GITHUB_CLIENT_ID, GITHUB_SECRET);

export const { handle, signIn, signOut } = SvelteKitAuth({
    providers: [
        GitHub({
            clientId: GITHUB_CLIENT_ID,
            clientSecret: GITHUB_SECRET
        })
    ],
});
