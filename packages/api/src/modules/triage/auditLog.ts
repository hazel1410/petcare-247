import { AIAuditLogEntry } from './types';

// Supabase client — stub interface until the real client is wired
interface SupabaseClient {
  from(table: string): {
    insert(data: Record<string, unknown>): Promise<{ error?: { message: string } }> | any;
  };
}

export async function writeAIAuditLog(
  supabase: SupabaseClient,
  entry: Omit<AIAuditLogEntry, 'id' | 'createdAt'>,
): Promise<void> {
  const { error } = await supabase.from('ai_audit_log').insert({
    session_id: entry.sessionId,
    model_version: entry.modelVersion,
    prompt: entry.prompt,
    output: entry.output,
    urgency_score: entry.urgencyScore,
    content_blocked: entry.contentBlocked,
    block_reason: entry.blockReason,
  });

  if (error) {
    // In production this should alert on-call; audit writes are critical-path
    // for compliance.
    throw new Error(`audit_log_write_failed: ${error.message}`);
  }
}
