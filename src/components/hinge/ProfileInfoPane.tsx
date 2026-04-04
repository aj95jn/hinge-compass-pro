import { Cake, User, Link2, BookOpen, Landmark, Globe, Search, Users } from 'lucide-react';
import { ProfileVitals } from '@/types';

interface ProfileInfoPaneProps {
  vitals: ProfileVitals;
}

const vitalIcons: Record<string, React.ReactNode> = {
  age: <Cake size={20} className="text-muted-foreground" />,
  gender: <User size={20} className="text-muted-foreground" />,
  orientation: <Link2 size={20} className="text-muted-foreground" />,
  religion: <BookOpen size={20} className="text-muted-foreground" />,
  politics: <Landmark size={20} className="text-muted-foreground" />,
  ethnicity: <Globe size={20} className="text-muted-foreground" />,
  datingGoals: <Search size={20} className="text-muted-foreground" />,
  relationshipType: <Users size={20} className="text-muted-foreground" />,
};

export function ProfileInfoPane({ vitals }: ProfileInfoPaneProps) {
  const topRow = [
    vitals.age && { key: 'age', value: vitals.age.toString() },
    vitals.gender && { key: 'gender', value: vitals.gender },
    vitals.orientation && { key: 'orientation', value: vitals.orientation },
  ].filter(Boolean) as { key: string; value: string }[];

  const detailRows = [
    vitals.religion && { key: 'religion', value: vitals.religion },
    vitals.politics && { key: 'politics', value: vitals.politics },
    vitals.ethnicity && { key: 'ethnicity', value: vitals.ethnicity },
    vitals.datingGoals && { key: 'datingGoals', value: vitals.datingGoals },
    vitals.relationshipType && { key: 'relationshipType', value: vitals.relationshipType },
  ].filter(Boolean) as { key: string; value: string }[];

  if (topRow.length === 0 && detailRows.length === 0) return null;

  return (
    <div className="bg-card rounded-2xl overflow-hidden border border-border">
      {/* Top row with dividers */}
      {topRow.length > 0 && (
        <div className="flex divide-x divide-border">
          {topRow.map((item) => (
            <div key={item.key} className="flex-1 flex items-center justify-center gap-2 py-4">
              {vitalIcons[item.key]}
              <span className="text-foreground font-medium">{item.value}</span>
            </div>
          ))}
        </div>
      )}

      {/* Detail rows */}
      {detailRows.length > 0 && (
        <div className="divide-y divide-border border-t border-border">
          {detailRows.map((item) => (
            <div key={item.key} className="flex items-center gap-4 px-5 py-4">
              {vitalIcons[item.key]}
              <span className="text-foreground font-medium">{item.value}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
