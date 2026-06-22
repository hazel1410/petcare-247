import { trpc } from '../lib/trpc.js';

export default function AdminPage() {
  const { data: metrics } = trpc.admin.getMetrics.useQuery();
  const { data: vets, refetch: refetchVets } = trpc.admin.listVets.useQuery();
  const { data: flags, refetch: refetchFlags } = trpc.featureFlags.list.useQuery();
  const updateFlag = trpc.featureFlags.update.useMutation({
    onSuccess: () => refetchFlags(),
  });

  return (
    <div style={{ maxWidth: 900, margin: '0 auto', paddingTop: 32 }}>
      <h1 style={{ fontSize: 28, fontWeight: 800, marginBottom: 24 }}>Admin Dashboard</h1>

      <div className="grid-3 mb-lg">
        <div className="card" style={{ textAlign: 'center', padding: 24 }}>
          <div style={{ fontSize: 36, marginBottom: 8 }}>👥</div>
          <div style={{ fontSize: 28, fontWeight: 800 }}>{metrics?.totalUsers ?? '-'}</div>
          <div className="text-muted" style={{ fontSize: 13 }}>Total Users</div>
        </div>
        <div className="card" style={{ textAlign: 'center', padding: 24 }}>
          <div style={{ fontSize: 36, marginBottom: 8 }}>❓</div>
          <div style={{ fontSize: 28, fontWeight: 800 }}>{metrics?.totalQuestions ?? '-'}</div>
          <div className="text-muted" style={{ fontSize: 13 }}>Total Questions</div>
        </div>
        <div className="card" style={{ textAlign: 'center', padding: 24 }}>
          <div style={{ fontSize: 36, marginBottom: 8 }}>🩺</div>
          <div style={{ fontSize: 28, fontWeight: 800 }}>{metrics?.activeVets ?? '-'}</div>
          <div className="text-muted" style={{ fontSize: 13 }}>Active Vets</div>
        </div>
      </div>

      <div className="grid-2" style={{ gap: 24 }}>
        <div>
          <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 16 }}>Vet Approvals</h2>
          {!vets ? (
            <p className="text-muted">Loading...</p>
          ) : vets.length === 0 ? (
            <p className="text-muted">No vets pending approval.</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {vets.map((vet) => (
                <div key={vet.id} className="card" style={{ padding: 16 }}>
                  <div className="flex items-center justify-between">
                    <div>
                      <div style={{ fontWeight: 600 }}>{vet.name}</div>
                      <div className="text-muted" style={{ fontSize: 13 }}>
                        {vet.licenseNumber} &middot; {vet.specialties?.join(', ')}
                      </div>
                    </div>
                    <span className={`badge badge-${vet.verificationStatus === 'approved' ? 'low' : vet.verificationStatus === 'rejected' ? 'critical' : 'urgent'}`}>
                      {vet.verificationStatus}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div>
          <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 16 }}>Feature Flags</h2>
          {!flags ? (
            <p className="text-muted">Loading...</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {flags.map((flag) => (
                <div key={flag.flag} className="card" style={{ padding: 12 }}>
                  <div className="flex items-center justify-between">
                    <div>
                      <div style={{ fontWeight: 600 }}>{flag.flag.replace(/_/g, ' ')}</div>
                      {flag.rolloutPercentage != null && (
                        <div className="text-muted" style={{ fontSize: 12 }}>
                          Rollout: {flag.rolloutPercentage}%
                        </div>
                      )}
                    </div>
                    <button
                      className={`btn btn-small ${flag.enabled ? 'btn-primary' : 'btn-ghost'}`}
                      onClick={() =>
                        updateFlag.mutate({ flag: flag.flag, enabled: !flag.enabled })
                      }
                      disabled={updateFlag.isPending}
                    >
                      {flag.enabled ? 'Enabled' : 'Disabled'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
