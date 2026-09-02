import time
import requests
from typing import Dict, Any

GITHUB_USERNAME = "DivyanshuRanjanDynamic"
LEETCODE_USERNAME = "Divyanshu_Ranjan_"

# In-memory cache for live activity stats (valid for 10 minutes)
STATS_CACHE: Dict[str, Any] = {
    "github": None,
    "leetcode": None,
    "last_fetched": 0
}
CACHE_TTL = 600  # 10 minutes

def fetch_github_data() -> Dict[str, Any]:
    try:
        user_res = requests.get(f"https://api.github.com/users/{GITHUB_USERNAME}", headers={"User-Agent": "PortfolioApp"}, timeout=5)
        if user_res.status_code == 200:
            user_data = user_res.json()
            repos_res = requests.get(f"https://api.github.com/users/{GITHUB_USERNAME}/repos?per_page=100", headers={"User-Agent": "PortfolioApp"}, timeout=5)
            stars = 0
            forks = 0
            if repos_res.status_code == 200:
                repos = repos_res.json()
                if isinstance(repos, list):
                    stars = sum(r.get("stargazers_count", 0) for r in repos)
                    forks = sum(r.get("forks_count", 0) for r in repos)
            
            return {
                "username": GITHUB_USERNAME,
                "repos": user_data.get("public_repos", 15),
                "followers": user_data.get("followers", 3),
                "stars": stars or 10,
                "forks": forks or 3,
                "status": "success"
            }
    except Exception as e:
        print("GitHub fetch error:", e)

    return {
        "username": GITHUB_USERNAME,
        "repos": 15,
        "followers": 3,
        "stars": 10,
        "forks": 3,
        "status": "fallback"
    }

def fetch_leetcode_data() -> Dict[str, Any]:
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
    try:
        r = requests.post(url, json={"query": query, "variables": {"username": LEETCODE_USERNAME}}, headers=headers, timeout=6)
        if r.status_code == 200:
            res_json = r.json()
            matched = res_json.get("data", {}).get("matchedUser", {})
            if matched:
                stats = matched.get("submitStats", {}).get("acSubmissionNum", [])
                total_item = next((s for s in stats if s.get("difficulty") == "All"), {})
                easy_item = next((s for s in stats if s.get("difficulty") == "Easy"), {})
                medium_item = next((s for s in stats if s.get("difficulty") == "Medium"), {})
                hard_item = next((s for s in stats if s.get("difficulty") == "Hard"), {})

                total_solved = total_item.get("count", 224)
                total_submissions = total_item.get("submissions", 482)
                acc_rate = round((total_solved / total_submissions * 100), 2) if total_submissions > 0 else 53.73

                return {
                    "username": LEETCODE_USERNAME,
                    "totalSolved": total_solved,
                    "easySolved": easy_item.get("count", 50),
                    "totalEasy": 962,
                    "mediumSolved": medium_item.get("count", 145),
                    "totalMedium": 2189,
                    "hardSolved": hard_item.get("count", 29),
                    "totalHard": 971,
                    "ranking": matched.get("profile", {}).get("ranking", 735328),
                    "acceptanceRate": acc_rate,
                    "status": "success"
                }
    except Exception as e:
        print("LeetCode fetch error:", e)

    return {
        "username": LEETCODE_USERNAME,
        "totalSolved": 224,
        "easySolved": 50,
        "totalEasy": 962,
        "mediumSolved": 145,
        "totalMedium": 2189,
        "hardSolved": 29,
        "totalHard": 971,
        "ranking": 735328,
        "acceptanceRate": 53.73,
        "status": "fallback"
    }

def get_live_activity_stats(force_refresh: bool = False) -> Dict[str, Any]:
    now = time.time()
    if force_refresh or STATS_CACHE["github"] is None or (now - STATS_CACHE["last_fetched"]) > CACHE_TTL:
        STATS_CACHE["github"] = fetch_github_data()
        STATS_CACHE["leetcode"] = fetch_leetcode_data()
        STATS_CACHE["last_fetched"] = now

    return {
        "github": STATS_CACHE["github"],
        "leetcode": STATS_CACHE["leetcode"],
        "timestamp": STATS_CACHE["last_fetched"]
    }
