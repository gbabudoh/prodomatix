import { prisma } from '../db/prisma.ts';
import type { Request } from 'express';

export type AuditAction =
  | 'auth.register' | 'auth.login' | 'auth.login_failed' | 'auth.login_locked'
  | 'auth.logout' | 'auth.verify_email' | 'auth.google'
  | 'purchase.checkout' | 'download.file'
  | 'admin.create_business' | 'admin.update_business' | 'admin.delete_business'
  | 'admin.update_user' | 'mfa.setup' | 'mfa.verified';

export async function audit(
  req: Request,
  action: AuditAction,
  opts: { userId?: number; resource?: string; resourceId?: string; metadata?: Record<string, unknown> } = {}
) {
  try {
    await prisma.auditLog.create({
      data: {
        userId:     opts.userId ?? (req as any).user?.id ?? null,
        action,
        resource:   opts.resource   ?? null,
        resourceId: opts.resourceId ?? null,
        ip:         (req.headers['x-forwarded-for'] as string)?.split(',')[0]?.trim() ?? req.socket.remoteAddress ?? null,
        userAgent:  req.headers['user-agent'] ?? null,
        metadata:   opts.metadata ? JSON.stringify(opts.metadata) : null,
      },
    });
  } catch {
    // Audit log failures must never crash the main request
  }
}
