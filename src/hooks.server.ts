import { redirect, type Handle } from "@sveltejs/kit";
import { handle as authenticationHandle } from "./auth";
import { sequence } from "@sveltejs/kit/hooks";

// CHeck if the user is authorized to view the page
// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function authorizationHandle({ event, resolve }: { event: any, resolve: any }) {
    // Protect any routes under /authenticated
    console.log("In redirect");
    console.log(event.url.pathname);
    if (
        event.url.pathname.startsWith("/dashboard") ||
        event.url.pathname.startsWith("/profile")
    ) {
        const session = await event.locals.auth();
        if (!session) {
            // Redirect to the signin page
            throw redirect(303, "/auth/signin");
        }
    }

    // If the request is still here, just proceed as normally
    return resolve(event);
}

// First authentication, then authorization
export const handle: Handle = sequence(authenticationHandle, authorizationHandle);
