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

router = APIRouter(
    prefix="/ai/chat",
    tags=["AI Chat"],
)


@router.post(
    "/conversations",
    response_model=ConversationResponse,
    status_code=status.HTTP_201_CREATED,
)
def create_conversation(
    conversation: ConversationCreate,
    service: Annotated[
        ConversationService,
        Depends(get_conversation_service),
    ],
) -> Conversation:
    """Create a conversation."""
    entity = Conversation(
        **conversation.model_dump(),
    )

    return service.create_conversation(entity)


@router.get(
    "/conversations/{conversation_id}",
    response_model=ConversationResponse,
)
def get_conversation(
    conversation_id: UUID,
    service: Annotated[
        ConversationService,
        Depends(get_conversation_service),
    ],
) -> Conversation:
    """Retrieve a conversation."""
    return service.get_conversation(
        conversation_id,
    )


@router.get(
    "/conversations",
    response_model=ConversationListResponse,
)
def list_conversations(
    organization_id: UUID,
    service: Annotated[
        ConversationService,
        Depends(get_conversation_service),
    ],
    offset: Annotated[
        int,
        Query(ge=0),
    ] = 0,
    limit: Annotated[
        int,
        Query(ge=1, le=100),
    ] = 20,
) -> ConversationListResponse:
    """List conversations."""
    conversations, total = service.list_conversations(
        organization_id,
        offset=offset,
        limit=limit,
    )

    return ConversationListResponse(
        items=[
            ChatMapper.conversation_response(
                conversation,
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
    service: Annotated[
        ConversationService,
        Depends(get_conversation_service),
    ],
) -> Conversation:
    """Update a conversation."""
    return service.update_conversation(
        conversation_id,
        update,
    )


@router.delete(
    "/conversations/{conversation_id}",
    status_code=status.HTTP_204_NO_CONTENT,
)
def delete_conversation(
    conversation_id: UUID,
    service: Annotated[
        ConversationService,
        Depends(get_conversation_service),
    ],
) -> Response:
    """Delete a conversation."""
    service.delete_conversation(
        conversation_id,
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
    service: Annotated[
        ConversationService,
        Depends(get_conversation_service),
    ],
) -> ConversationMessage:
    """Add a message to a conversation."""
    message = ConversationMessage(
        **request.model_dump(),
    )

    return service.add_message(
        conversation_id,
        message,
    )


@router.get(
    "/conversations/{conversation_id}/messages",
    response_model=ConversationHistoryResponse,
)
def get_history(
    conversation_id: UUID,
    service: Annotated[
        ConversationService,
        Depends(get_conversation_service),
    ],
) -> ConversationHistoryResponse:
    """Retrieve conversation history."""
    conversation = service.get_conversation(
        conversation_id,
    )

    messages = service.get_history(
        conversation_id,
    )

    return ConversationHistoryResponse(
        conversation=ChatMapper.conversation_response(
            conversation,
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
    service: Annotated[
        ConversationService,
        Depends(get_conversation_service),
    ],
) -> ChatResponse:
    """Send a message to an AI conversation."""
    if request.conversation_id != conversation_id:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=("Conversation ID in path " "does not match request body."),
        )

    return service.send_message(
        request,
    )
