import { Octokit } from "@octokit/core";
import type { Endpoints } from "@octokit/types";

type listUserReposParameters = Endpoints["GET /user"]["response"];
type listUserReposResponse = Endpoints["GET /users/{username}/repos"]["response"];
type listLanguagesResponse = Endpoints["GET /repos/{owner}/{repo}/languages"]["response"];

let octokit: Octokit;
let signedInUser: string;

/**
 * Get an instance of Octokit to use, or create one if it doesn't exist.
 * @param accessToken github access token.
 * @returns {Octokit}
 */
const getOctokitInstance = (accessToken: string): Octokit => {
    if (!octokit) {
        octokit = new Octokit({
            auth: accessToken
        });
    }
    return octokit;
};

/**
 * Preload the logged in user to prevent needing to check this again later.
 * @param accessToken github access token.
 */
export const fetchUserDetails = async (accessToken: string): Promise<void> => {
    const octokit = getOctokitInstance(accessToken);
    const { data }: listUserReposParameters = await octokit.request("GET /user");
    signedInUser = data.login;
};

/**
 * Fetch the repositories for the logged in user.
 * @param accessToken 
 * @returns 
 */
export const fetchRepositoriesForUser = async (
    accessToken: string
): Promise<string[]> => {
    const octokit = getOctokitInstance(accessToken);
    const userRepositories: listUserReposResponse = await octokit.request("GET /users/{username}/repos", {
        username: signedInUser
    });

    return userRepositories.data.map((repo) => repo.name);
};

/**
 * Fetch the data for a single repository.
 * @param accessToken 
 * @param repoName 
 * @returns 
 */
export const fetchRepositoryData = async (
    accessToken: string,
    repoName: string
): Promise<{
    name: string;
    languages: listLanguagesResponse;
}> => {
    const octokit = getOctokitInstance(accessToken);

    const languages: listLanguagesResponse = await octokit.request("GET /repos/{owner}/{repo}/languages", {
        owner: signedInUser,
        repo: repoName
    });

    return {
        name: repoName,
        languages
    };
};

/**
 * Fetch each repository for the user.
 * @param accessToken github access token.
 * @returns 
 */
export const fetchAllRepositoryData = async (
    accessToken: string
): Promise<{
    name: string;
    languages: listLanguagesResponse
}[]> => {
    const repositories = await fetchRepositoriesForUser(accessToken);
    return Promise.all(repositories.map((repo) => fetchRepositoryData(accessToken, repo)));
};
