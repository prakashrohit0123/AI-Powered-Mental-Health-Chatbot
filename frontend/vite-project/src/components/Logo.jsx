import { Heart } from 'lucide-react';
export function Logo() {
  return (
    <div className="flex items-center space-x-2">
      <Heart className="h-8 w-8 text-rose-500" />
      <span className="text-xl font-semibold text-gray-900">PeaceinMe</span>
    </div>
  );
}