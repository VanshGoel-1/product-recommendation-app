from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session, select
from typing import List
import json

from app.db.db import get_session
from app.models.models import Order
from app.schemas.order import OrderCreate, OrderRead
from app.core.auth import get_auth_user

router = APIRouter(prefix="/api/v1/orders", tags=["orders"])

@router.post("/", response_model=OrderRead)
async def create_order(
    order_in: OrderCreate,
    session: Session = Depends(get_session),
    user_payload: dict = Depends(get_auth_user)
):
    user_id = user_payload["sub"]
    # Serialize items to JSON string for storage
    # In a real app we might use a separate OrderItem table, but this keeps it simple per "don't change current working"
    items_json = json.dumps(order_in.items)
    
    order = Order(
        user_id=user_id,
        items=items_json,
        total_amount=order_in.total_amount,
        shipping_address=order_in.shipping_address,
        status=order_in.status
    )
    
    session.add(order)
    session.commit()
    session.refresh(order)
    return order

@router.get("/", response_model=List[OrderRead])
async def get_orders(
    session: Session = Depends(get_session),
    user_payload: dict = Depends(get_auth_user)
):
    user_id = user_payload["sub"]
    statement = select(Order).where(Order.user_id == user_id).order_by(Order.created_at.desc())
    orders = session.exec(statement).all()
    return orders
