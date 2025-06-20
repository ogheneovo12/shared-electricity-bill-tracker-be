import { SetMetadata } from '@nestjs/common';

export enum WorkspaceAccessLevel {
  ALL = 'all',
  OWNER = 'owner',
  MEMBER = 'member',
  OWNER_OR_MEMBER = 'owner_or_member',
  MEMBER_MENTOR = 'mentor',
  MEMBER_MENTEE = 'mentee',
  OWNER_OR_MEMBER_MENTOR = 'owner_or_member_mentor',
  OWNER_OR_MEMBER_MENTEE = 'owner_or_member_mentee',
}

export const WorkspaceAccessLevelCheck = (
  role: WorkspaceAccessLevel = WorkspaceAccessLevel.OWNER,
) => SetMetadata('workspace-access-level', role);
