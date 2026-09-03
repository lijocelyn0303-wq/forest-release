import { useReleaseStore, EmotionType } from '../store/useReleaseStore';
import EmotionOrb from './EmotionOrb';

const emotions: { key: EmotionType; label: string; color: string; pos: [number, number, number] }[] = [
  { key: 'anxiety', label: '焦虑', color: '#9D91FF', pos: [-4, 0, 0] },
  { key: 'anger', label: '愤怒', color: '#E87A7A', pos: [-2, 0.4, 0] },
  { key: 'sadness', label: '悲伤', color: '#5A7BBF', pos: [0, 0, 0] },
  { key: 'suppression', label: '压抑', color: '#7FB294', pos: [2, 0.4, 0] },
  { key: 'exhaustion', label: '疲惫', color: '#C7BDB3', pos: [4, 0, 0] },
];

export default function EmotionOrbField() {
  const { emotion: selectedEmotion, setEmotion } = useReleaseStore();

  return (
    <group position={[0, 0.4, 0]}>
      {emotions.map((config) => (
        <EmotionOrb
          key={config.key}
          label={config.label}
          color={config.color}
          pos={config.pos}
          isSelected={selectedEmotion === config.key}
          onSelect={() => setEmotion(config.key)}
        />
      ))}
    </group>
  );
}
