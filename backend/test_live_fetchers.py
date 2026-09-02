import requests
import json

def test_github():
    url = "https://api.github.com/users/DivyanshuRanjanDynamic"
    r = requests.get(url, headers={"User-Agent": "Portfolio-App"})
    if r.status_code == 200:
        data = r.json()
        print("GitHub User Data:")
        print(f"Public Repos: {data.get('public_repos')}")
        print(f"Followers: {data.get('followers')}")

        repos_res = requests.get("https://api.github.com/users/DivyanshuRanjanDynamic/repos?per_page=100", headers={"User-Agent": "Portfolio-App"})
        if repos_res.status_code == 200:
            repos = repos_res.json()
            stars = sum(repo.get("stargazers_count", 0) for repo in repos)
            forks = sum(repo.get("forks_count", 0) for repo in repos)
            print(f"Total Stars: {stars}, Total Forks: {forks}")
    else:
        print("GitHub error:", r.status_code, r.text)

def test_leetcode():
    # LeetCode GraphQL Endpoint
    url = "https://leetcode.com/graphql"
    query = """
    query userSessionProgress($username: String!) {
      matchedUser(username: $username) {
        username
        submitStats: submitStatsGlobal {
          acSubmissionNum {
            difficulty
            count
            submissions
          }
        }
        profile {
          ranking
          reputation
        }
      }
    }
    """
    headers = {
        "Content-Type": "application/json",
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)"
    }
    r = requests.post(url, json={"query": query, "variables": {"username": "Divyanshu_Ranjan_"}}, headers=headers)
    if r.status_code == 200:
        print("LeetCode GraphQL Response:")
        print(json.dumps(r.json(), indent=2))
    else:
        print("LeetCode GraphQL error:", r.status_code, r.text)

if __name__ == "__main__":
    print("--- TESTING GITHUB ---")
    test_github()
    print("\n--- TESTING LEETCODE GRAPHQL ---")
    test_leetcode()
