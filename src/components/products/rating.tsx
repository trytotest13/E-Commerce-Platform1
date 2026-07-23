import { Star } from "lucide-react";
interface Props { value: number; readonly?: boolean; size?: number; onChange?: (r: number) => void; }
export function Rating({ value, readonly = true, size = 20, onChange }: Props) {
  return (
    <div className="flex gap-1">
      {[1,2,3,4,5].map(star => (
        <button key={star} type="button" disabled={readonly} onClick={() => onChange?.(star)} className={readonly ? "cursor-default" : "cursor-pointer"}>
          <Star size={size} className={star <= Math.round(value) ? "fill-yellow-400 text-yellow-400" : "fill-none text-gray-300"} />
        </button>
      ))}
    </div>
  );
}
