def link_repos_to_agents(repos):
    linked_data = []
    for repo in repos:
        agent_data = {
            'repo_name': repo['name'],
            'repo_url': repo['html_url'],
            'description': repo['description'],
        }
        linked_data.append(agent_data)
    return linked_data
