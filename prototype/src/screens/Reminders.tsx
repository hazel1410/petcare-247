import { useState } from 'react';
import { useApp } from '../app';
import { BackHeader, Icon } from '../ui';
import { REMINDERS } from '../mock';
import type { ReminderItem } from '../mock';

export function RemindersScreen() {
  const a = useApp();
  const pet = a.pets.find((p) => p.id === a.params?.petId) ?? a.pets[0];
  const petName = pet?.name ?? 'your pet';

  const [reminders, setReminders] = useState<ReminderItem[]>([...REMINDERS]);

  function toggle(id: string) {
    setReminders((prev) =>
      prev.map((r) => (r.id === id ? { ...r, on: !r.on } : r))
    );
  }

  function addReminder() {
    const newItem: ReminderItem = {
      id: `r_new_${Date.now()}`,
      title: 'New reminder',
      type: 'medication',
      emoji: '🔔',
      schedule: 'Tap to set',
      caregiver: 'You',
      on: true,
    };
    setReminders((prev) => [newItem, ...prev]);
  }

  return (
    <div className="screen fade">
      <BackHeader title="Reminders" />

      <div className="pad stack">
        <p className="body muted">
          Never miss a dose, meal, or shot — shared with everyone who cares for{' '}
          <span className="strong">{petName}</span>.
        </p>

        <div className="stack-sm">
          {reminders.map((r) => (
            <div key={r.id} className="card" style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
              {/* Left: emoji */}
              <span style={{ fontSize: 28, lineHeight: 1, flexShrink: 0 }}>{r.emoji}</span>

              {/* Middle: title + schedule + caregiver */}
              <div className="grow" style={{ minWidth: 0 }}>
                <div className="h3" style={{ marginBottom: 2 }}>{r.title}</div>
                <div className="small muted" style={{ marginBottom: 4 }}>{r.schedule}</div>
                <div className="row" style={{ alignItems: 'center', gap: 4 }}>
                  <Icon name="account" size={12} color="var(--text-muted)" />
                  <span className="tiny muted">{r.caregiver}</span>
                </div>
              </div>

              {/* Right: toggle */}
              <button
                className={'switch' + (r.on ? ' on' : '')}
                onClick={() => toggle(r.id)}
                aria-label={r.on ? 'Turn off' : 'Turn on'}
                style={{ flexShrink: 0 }}
              >
                <span />
              </button>
            </div>
          ))}
        </div>

        <button className="btn btn-primary" style={{ width: '100%', marginTop: 4 }} onClick={addReminder}>
          ＋ Add a reminder
        </button>

        <p className="tiny muted center">
          Caregivers you invite get the same reminders.
        </p>

        <div style={{ height: 40 }} />
      </div>
    </div>
  );
}
