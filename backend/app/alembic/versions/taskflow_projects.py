"""Create TaskFlow projects table.

Revision ID: taskflow_projects
Revises: 1a31ce608336
"""

from alembic import op
import sqlalchemy as sa

revision = "taskflow_projects"
down_revision = "1a31ce608336"
branch_labels = None
depends_on = None


def upgrade():
    op.create_table(
        "project",
        sa.Column("id", sa.UUID(), nullable=False),
        sa.Column("name", sa.String(length=120), nullable=False),
        sa.Column("description", sa.String(length=1000), nullable=True),
        sa.Column("owner_id", sa.UUID(), nullable=False),
        sa.Column("created_at", sa.DateTime(timezone=True), nullable=False),
        sa.ForeignKeyConstraint(["owner_id"], ["user.id"], ondelete="CASCADE"),
        sa.PrimaryKeyConstraint("id"),
    )
    op.create_index("ix_project_owner_id", "project", ["owner_id"], unique=False)


def downgrade():
    op.drop_index("ix_project_owner_id", table_name="project")
    op.drop_table("project")
