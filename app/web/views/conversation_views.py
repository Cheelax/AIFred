from flask import Blueprint, request, Response, jsonify, stream_with_context
from web.hooks import load_model
from web.db.models import Pdf, Conversation, Message
from app.chat import build_chat, ChatArgs
from utils.github import get_public_repos
from utils.agent import link_repos_to_agents

bp = Blueprint("conversation", __name__, url_prefix="/api/conversations")

@bp.route("/", methods=["GET"])
@load_model(Pdf, lambda r: r.args.get("pdf_id"))
def list_conversations(pdf):
    return [c.as_dict() for c in pdf.conversations]

@bp.route("/", methods=["POST"])
@load_model(Pdf, lambda r: r.args.get("pdf_id"))
def create_conversation(pdf=None):
    user_id = 1  # This should be replaced with actual user identification logic
    repo_usernames = request.json.get('repo_usernames', [])  # Expecting a list of usernames
    all_repos = []

    for username in repo_usernames:
        repos = get_public_repos(username)
        linked_repos = link_repos_to_agents(repos)
        all_repos.extend(linked_repos)
    
    conversation = Conversation.create(user_id=user_id, pdf_id=pdf.id if pdf else None, repos=all_repos)
    return jsonify(conversation.as_dict())

@bp.route("/<string:conversation_id>/messages", methods=["POST"])
@load_model(Conversation)
def create_message(conversation):
    input = request.json.get("input")
    streaming = request.args.get("stream", False)
    chat_args = ChatArgs(
        conversation_id=conversation.id,
        pdf_id=conversation.pdf_id,
        repos=conversation.repos,
        streaming=streaming,
        metadata={
            "conversation_id": conversation.id,
            "user_id": conversation.user_id,
            "pdf_id": conversation.pdf_id,
            "repos": conversation.repos,
        },
    )
    chat = build_chat(chat_args)

    if not chat:
        return "Chat not yet implemented!"

    if streaming:
        return Response(
            stream_with_context(chat.stream(input)), mimetype="text/event-stream"
        )
    else:
        return jsonify({"role": "assistant", "content": chat.run(input)})

@bp.route("/<string:conversation_id>/messages", methods=["GET"])
@load_model(Conversation)
def get_messages(conversation):
    messages = Message.query.filter_by(conversation_id=conversation.id).order_by(Message.created_on.desc()).all()
    return jsonify([message.as_lc_message() for message in messages])

@bp.route("/<string:conversation_id>/components", methods=["GET"])
@load_model(Conversation)
def get_conversation_components(conversation):
    components = {
        "llm": conversation.llm,
        "retriever": conversation.retriever,
        "memory": conversation.memory,
    }
    return jsonify(components)

@bp.route("/<string:conversation_id>/components", methods=["POST"])
@load_model(Conversation)
def set_conversation_components(conversation):
    data = request.json
    llm = data.get('llm')
    retriever = data.get('retriever')
    memory = data.get('memory')

    if not llm or not retriever or not memory:
        return jsonify({'error': 'All components are required'}), 400

    conversation.llm = llm
    conversation.retriever = retriever
    conversation.memory = memory
    db.session.commit()
    return jsonify({'success': 'Components updated successfully'})

@bp.route("/github/public_repos", methods=["GET"])
def public_repos():
    username = request.args.get('username')
    if not username:
        return jsonify({'error': 'Username is required'}), 400

    repos = get_public_repos(username)
    if not repos:
        return jsonify({'error': 'No repositories found or user does not exist'}), 404

    linked_data = link_repos_to_agents(repos)
    return jsonify({'linked_repos': linked_data})
