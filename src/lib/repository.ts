import { Octokit } from "@octokit/core";
import type { Endpoints } from "@octokit/types";

type listUserReposParameters = Endpoints["GET /user"]["response"];
type listUserReposResponse = Endpoints["GET /users/{username}/repos"]["response"];
type listLanguagesResponse = Endpoints["GET /repos/{owner}/{repo}/languages"]["response"];

let octokit: Octokit;

/**
 * Get an instance of Octokit to use, or create one if it doesn't exist.
 * @param accessToken github access token.
 * @returns 
 */
const getOctokitInstance = async (accessToken: string) => {
    if (!octokit) {
        octokit = new Octokit({
            auth: accessToken
        });
    }
    return octokit;
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
    const octokit = await getOctokitInstance(accessToken);
    const { data }: listUserReposParameters = await octokit.request("GET /user");

    const userRepositories: listUserReposResponse = await octokit.request("GET /users/{username}/repos", {
        username: data.login
    });
    // languages returns how man bytes of each language file
    const allRepositoryData = await Promise.all(userRepositories.data.map((repo) => (
        octokit.request("GET /repos/{owner}/{repo}/languages", {
            owner: data.login,
            repo: repo.name
        })
    )));

    return userRepositories.data.map((userRepo, index) => ({
        name: userRepo.name,
        languages: allRepositoryData[index]
    }));
};
