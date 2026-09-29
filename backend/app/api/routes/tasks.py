import uuid
from datetime import UTC, datetime

from fastapi import APIRouter, HTTPException
from sqlmodel import select

from app.api.deps import CurrentUser, SessionDep
from app.models import Project, Task, TaskCreate, TaskPublic, TasksPublic, TaskUpdate

router = APIRouter(prefix="/tasks", tags=["tasks"])


def owned_project(session: SessionDep, project_id: uuid.UUID, user_id: uuid.UUID) -> Project:
    project = session.get(Project, project_id)
    if not project or project.owner_id != user_id:
        raise HTTPException(status_code=404, detail="Project not found")
    return project


@router.post("/", response_model=TaskPublic)
def create_task(task_in: TaskCreate, session: SessionDep, current_user: CurrentUser) -> Task:
    owned_project(session, task_in.project_id, current_user.id)
    task = Task(**task_in.model_dump(), owner_id=current_user.id)
    session.add(task)
    session.commit()
    session.refresh(task)
    return task


@router.get("/", response_model=TasksPublic)
def list_tasks(session: SessionDep, current_user: CurrentUser, project_id: uuid.UUID | None = None) -> TasksPublic:
    statement = select(Task).where(Task.owner_id == current_user.id).order_by(Task.created_at.desc())
    if project_id:
        owned_project(session, project_id, current_user.id)
        statement = statement.where(Task.project_id == project_id)
    tasks = session.exec(statement).all()
    return TasksPublic(data=tasks, count=len(tasks))


@router.patch("/{task_id}", response_model=TaskPublic)
def update_task(task_id: uuid.UUID, task_in: TaskUpdate, session: SessionDep, current_user: CurrentUser) -> Task:
    task = session.get(Task, task_id)
    if not task or task.owner_id != current_user.id:
        raise HTTPException(status_code=404, detail="Task not found")
    task.sqlmodel_update(task_in.model_dump(exclude_unset=True), update={"updated_at": datetime.now(UTC)})
    session.add(task)
    session.commit()
    session.refresh(task)
    return task


@router.delete("/{task_id}")
def delete_task(task_id: uuid.UUID, session: SessionDep, current_user: CurrentUser) -> dict[str, str]:
    task = session.get(Task, task_id)
    if not task or task.owner_id != current_user.id:
        raise HTTPException(status_code=404, detail="Task not found")
    session.delete(task)
    session.commit()
    return {"message": "Task deleted successfully"}
