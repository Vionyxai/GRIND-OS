import { useState } from 'react';
import { Pillar, Routine, DailyLog } from '../types';
import { PillarCard } from '../components/PillarCard';
import { AddRoutineModal } from '../components/AddRoutineModal';
import { getAdaptedDifficulty } from '../utils/xp';
import { getTodayString } from '../utils/dates';

interface PillarsProps {
  pillars: Pillar[];
  routines: Routine[];
  logs: DailyLog[];
  completedIds: string[];
  onToggleRoutine: (routineId: string) => void;
  onAddRoutine: (routine: Omit<Routine, 'id' | 'createdAt'>) => void;
  onEditRoutine: (routineId: string, updates: Omit<Routine, 'id' | 'createdAt'>) => void;
  onDeleteRoutine: (routineId: string) => void;
}

export function Pillars({
  pillars,
  routines,
  logs,
  completedIds,
  onToggleRoutine,
  onAddRoutine,
  onEditRoutine,
  onDeleteRoutine,
}: PillarsProps) {
  const today = getTodayString();
  const adaptedDifficulties: Record<string, Routine['difficulty']> = {};
  routines.forEach((r) => {
    adaptedDifficulties[r.id] = getAdaptedDifficulty(r.id, r.createdAt, logs, r.difficulty, today);
  });
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedPillarId, setSelectedPillarId] = useState<string>('health');
  const [editingRoutine, setEditingRoutine] = useState<Routine | null>(null);

  const handleAddRoutine = (pillarId: string) => {
    setSelectedPillarId(pillarId);
    setEditingRoutine(null);
    setModalOpen(true);
  };

  const handleEditRoutine = (routine: Routine) => {
    setEditingRoutine(routine);
    setSelectedPillarId(routine.pillarId);
    setModalOpen(true);
  };

  const handleSave = (data: Omit<Routine, 'id' | 'createdAt'>) => {
    if (editingRoutine) {
      onEditRoutine(editingRoutine.id, data);
    } else {
      onAddRoutine(data);
    }
    setEditingRoutine(null);
    setModalOpen(false);
  };

  return (
    <div className="px-4 py-4 overflow-x-hidden">
      <p
        style={{
          fontFamily: 'Bebas Neue, sans-serif',
          fontSize: '28px',
          color: '#F8F9FA',
          letterSpacing: '0.06em',
          marginBottom: '16px',
        }}
      >
        YOUR PILLARS
      </p>

      {pillars.map((pillar) => (
        <PillarCard
          key={pillar.id}
          pillar={pillar}
          routines={routines}
          completedIds={completedIds}
          adaptedDifficulties={adaptedDifficulties}
          onToggleRoutine={onToggleRoutine}
          onAddRoutine={handleAddRoutine}
          onEditRoutine={handleEditRoutine}
          onDeleteRoutine={onDeleteRoutine}
        />
      ))}

      <AddRoutineModal
        isOpen={modalOpen}
        initialPillarId={selectedPillarId}
        editingRoutine={editingRoutine}
        onSave={handleSave}
        onClose={() => {
          setModalOpen(false);
          setEditingRoutine(null);
        }}
      />
    </div>
  );
}
