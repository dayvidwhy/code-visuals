import { SvelteKitAuth } from "@auth/sveltekit";
import GitHub from "@auth/sveltekit/providers/github";
import { GITHUB_CLIENT_ID, GITHUB_SECRET } from "$env/static/private";

export const { handle, signIn, signOut } = SvelteKitAuth({
    providers: [
        GitHub({
            clientId: GITHUB_CLIENT_ID,
            clientSecret: GITHUB_SECRET,
        })
    ],
    callbacks: {
        async jwt({ token, account }) {
            if (account && account.access_token) {
                token.accessToken = account.access_token;
            }
            return token;
        },
        async session({ token, session }) {
            return {
                ...session,
                accessToken: token.accessToken
            };
        }
    },
    session: {
        strategy: "jwt"
    }
});
