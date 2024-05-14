import requests
import os
import subprocess
import json
from datetime import datetime

def clone_github_repos():
    
    response = requests.get('https://api.github.com/orgs/z-korp/repos', headers=headers)

    if response.status_code == 200:
        repos = response.json()
        code_directory = os.path.join(os.getcwd(), 'Code')
        os.makedirs(code_directory, exist_ok=True)

        # Load the last update times from the JSON file
        try:
            with open('last_updates.json', 'r') as f:
                last_updates = json.load(f)
        except FileNotFoundError:
            last_updates = {}

        url = "https://api.github.com/user"
        headers = {'Authorization': PUTVAR,  'X-GitHub-Api-Version': '2022-11-28', 'Accept': 'application/vnd.github+json'}
        response = requests.get(url, headers=headers)

        for repo in repos:
            clone_or_pull_repo(repo, last_updates, code_directory)

        # Get a specific repo from your personal GitHub
        response = requests.get('https://api.github.com/repos/cheelax/AiFred', headers=headers)
        print(response.content)
        if response.status_code == 200:
            repo = response.json()
            clone_or_pull_repo(repo, last_updates, code_directory)

        # Save the last update times to the JSON file
        with open('last_updates.json', 'w') as f:
            json.dump(last_updates, f)
    else:
        print(f"Failed to get repos: {response.content}")

def clone_or_pull_repo(repo, last_updates, code_directory):
    last_update = datetime.strptime(repo['updated_at'], '%Y-%m-%dT%H:%M:%SZ')
    if repo['name'] not in last_updates or last_update > datetime.strptime(last_updates[repo['name']], '%Y-%m-%dT%H:%M:%SZ'):
        print(f"Cloning or pulling repo: {repo['name']} at {repo['clone_url']}")
        os.chdir(code_directory)
        if os.path.exists(repo['name']):
            # If the repo already exists, pull the latest changes
            os.chdir(repo['name'])
            subprocess.run(['git', 'pull'])
            os.chdir('..')
        else:
            # If the repo doesn't exist, clone it
            subprocess.run(['git', 'clone', repo['clone_url']])
        # Update the last update time
        last_updates[repo['name']] = repo['updated_at']