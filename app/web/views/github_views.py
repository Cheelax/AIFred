from flask import Blueprint, request, jsonify
from utils.github import get_public_repos
from utils.agent import link_repos_to_agents

bp = Blueprint('github', __name__, url_prefix='/api/github')

@bp.route('/public_repos', methods=['GET'])
def public_repos():
    username = request.args.get('username')
    if not username:
        return jsonify({'error': 'Username is required'}), 400

    repos = get_public_repos(username)
    if not repos:
        return jsonify({'error': 'No repositories found or user does not exist'}), 404

    linked_data = link_repos_to_agents(repos)
    return jsonify({'linked_repos': linked_data})
