"""Router for AI chat."""

from __future__ import annotations

from typing import Annotated
from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException, Query, Response, status

from app.ai.chat.dependencies import get_conversation_service
from app.ai.chat.mappers.chat import ChatMapper
from app.ai.chat.models import Conversation, ConversationMessage
from app.ai.chat.schemas import (
    ChatRequest,
    ChatResponse,
    ConversationCreate,
    ConversationHistoryResponse,
    ConversationListResponse,
    ConversationResponse,
    ConversationUpdate,
    MessageCreate,
    MessageResponse,
)
from app.ai.chat.service import ConversationService
from app.auth.dependencies import CurrentActiveUserDependency

router = APIRouter(
    prefix="/ai/chat",
    tags=["AI Chat"],
)

ConversationServiceDependency = Annotated[
    ConversationService,
    Depends(get_conversation_service),
]


@router.post(
    "/conversations",
    response_model=ConversationResponse,
    status_code=status.HTTP_201_CREATED,
)
def create_conversation(
    conversation: ConversationCreate,
    current_user: CurrentActiveUserDependency,
    service: ConversationServiceDependency,
) -> ConversationResponse:
    """Create a conversation owned by the caller."""
    entity = Conversation(
        **conversation.model_dump(),
        organization_id=current_user.organization_id,
        created_by=current_user.id,
    )

    created = service.create_conversation(entity)

    return ChatMapper.conversation_response(created)


@router.get(
    "/conversations/{conversation_id}",
    response_model=ConversationResponse,
)
def get_conversation(
    conversation_id: UUID,
    current_user: CurrentActiveUserDependency,
    service: ConversationServiceDependency,
) -> ConversationResponse:
    """Retrieve a conversation owned by the caller."""
    conversation = service.get_conversation(
        conversation_id,
        current_user.organization_id,
        current_user.id,
    )

    return ChatMapper.conversation_response(conversation)


@router.get(
    "/conversations",
    response_model=ConversationListResponse,
)
def list_conversations(
    current_user: CurrentActiveUserDependency,
    service: ConversationServiceDependency,
    offset: Annotated[
        int,
        Query(ge=0),
    ] = 0,
    limit: Annotated[
        int,
        Query(ge=1, le=100),
    ] = 20,
) -> ConversationListResponse:
    """List the caller's conversations."""
    conversations, total, message_counts = service.list_conversations(
        current_user.organization_id,
        current_user.id,
        offset=offset,
        limit=limit,
    )

    return ConversationListResponse(
        items=[
            ChatMapper.conversation_response(
                conversation,
                message_counts.get(conversation.id, 0),
            )
            for conversation in conversations
        ],
        total=total,
        offset=offset,
        limit=limit,
    )


@router.patch(
    "/conversations/{conversation_id}",
    response_model=ConversationResponse,
)
def update_conversation(
    conversation_id: UUID,
    update: ConversationUpdate,
    current_user: CurrentActiveUserDependency,
    service: ConversationServiceDependency,
) -> ConversationResponse:
    """Update a conversation owned by the caller."""
    conversation = service.update_conversation(
        conversation_id,
        current_user.organization_id,
        current_user.id,
        update,
    )

    return ChatMapper.conversation_response(conversation)


@router.delete(
    "/conversations/{conversation_id}",
    status_code=status.HTTP_204_NO_CONTENT,
)
def delete_conversation(
    conversation_id: UUID,
    current_user: CurrentActiveUserDependency,
    service: ConversationServiceDependency,
) -> Response:
    """Delete a conversation owned by the caller."""
    service.delete_conversation(
        conversation_id,
        current_user.organization_id,
        current_user.id,
    )

    return Response(
        status_code=status.HTTP_204_NO_CONTENT,
    )


@router.post(
    "/conversations/{conversation_id}/messages",
    response_model=MessageResponse,
    status_code=status.HTTP_201_CREATED,
)
def add_message(
    conversation_id: UUID,
    request: MessageCreate,
    current_user: CurrentActiveUserDependency,
    service: ConversationServiceDependency,
) -> ConversationMessage:
    """Add a message to a conversation owned by the caller."""
    message = ConversationMessage(
        **request.model_dump(),
    )

    return service.add_message(
        conversation_id,
        current_user.organization_id,
        current_user.id,
        message,
    )


@router.get(
    "/conversations/{conversation_id}/messages",
    response_model=ConversationHistoryResponse,
)
def get_history(
    conversation_id: UUID,
    current_user: CurrentActiveUserDependency,
    service: ConversationServiceDependency,
) -> ConversationHistoryResponse:
    """Retrieve conversation history."""
    conversation = service.get_conversation(
        conversation_id,
        current_user.organization_id,
        current_user.id,
    )

    messages = service.get_history(
        conversation_id,
        current_user.organization_id,
        current_user.id,
    )

    return ConversationHistoryResponse(
        conversation=ChatMapper.conversation_response(
            conversation,
            len(messages),
        ),
        messages=[ChatMapper.message_response(m) for m in messages],
    )


@router.post(
    "/conversations/{conversation_id}/chat",
    response_model=ChatResponse,
    status_code=status.HTTP_200_OK,
)
def send_message(
    conversation_id: UUID,
    request: ChatRequest,
    current_user: CurrentActiveUserDependency,
    service: ConversationServiceDependency,
) -> ChatResponse:
    """Send a message to an AI conversation."""
    if request.conversation_id != conversation_id:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=("Conversation ID in path " "does not match request body."),
        )

    return service.send_message(
        request,
        current_user.organization_id,
        current_user.id,
    )
