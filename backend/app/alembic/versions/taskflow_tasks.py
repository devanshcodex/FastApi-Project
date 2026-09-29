"""Create TaskFlow tasks table.

Revision ID: taskflow_tasks
Revises: taskflow_projects
"""

from alembic import op
import sqlalchemy as sa

revision = "taskflow_tasks"
down_revision = "taskflow_projects"
branch_labels = None
depends_on = None


def upgrade():
    op.create_table(
        "task",
        sa.Column("id", sa.UUID(), nullable=False),
        sa.Column("title", sa.String(length=200), nullable=False),
        sa.Column("description", sa.String(length=2000), nullable=True),
        sa.Column("status", sa.String(length=20), nullable=False),
        sa.Column("priority", sa.String(length=20), nullable=False),
        sa.Column("due_date", sa.DateTime(timezone=True), nullable=True),
        sa.Column("project_id", sa.UUID(), nullable=False),
        sa.Column("owner_id", sa.UUID(), nullable=False),
        sa.Column("created_at", sa.DateTime(timezone=True), nullable=False),
        sa.Column("updated_at", sa.DateTime(timezone=True), nullable=False),
        sa.ForeignKeyConstraint(["project_id"], ["project.id"], ondelete="CASCADE"),
        sa.ForeignKeyConstraint(["owner_id"], ["user.id"], ondelete="CASCADE"),
        sa.PrimaryKeyConstraint("id"),
    )
    op.create_index("ix_task_project_id", "task", ["project_id"], unique=False)
    op.create_index("ix_task_owner_id", "task", ["owner_id"], unique=False)


def downgrade():
    op.drop_index("ix_task_owner_id", table_name="task")
    op.drop_index("ix_task_project_id", table_name="task")
    op.drop_table("task")
