import uuid

from fastapi import APIRouter, HTTPException
from sqlmodel import select

from app.api.deps import CurrentUser, SessionDep
from app.models import Project, ProjectCreate, ProjectPublic, ProjectsPublic

router = APIRouter(prefix="/projects", tags=["projects"])


@router.post("/", response_model=ProjectPublic)
def create_project(
    project_in: ProjectCreate, session: SessionDep, current_user: CurrentUser
) -> Project:
    project = Project(**project_in.model_dump(), owner_id=current_user.id)
    session.add(project)
    session.commit()
    session.refresh(project)
    return project


@router.get("/", response_model=ProjectsPublic)
def list_projects(session: SessionDep, current_user: CurrentUser) -> ProjectsPublic:
    projects = session.exec(
        select(Project)
        .where(Project.owner_id == current_user.id)
        .order_by(Project.created_at.desc())
    ).all()
    return ProjectsPublic(data=projects, count=len(projects))


@router.get("/{project_id}", response_model=ProjectPublic)
def get_project(
    project_id: uuid.UUID, session: SessionDep, current_user: CurrentUser
) -> Project:
    project = session.get(Project, project_id)
    if not project or project.owner_id != current_user.id:
        raise HTTPException(status_code=404, detail="Project not found")
    return project
