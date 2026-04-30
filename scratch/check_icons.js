import * as Lucide from 'lucide-react';

const icons = ['CheckCircle2', 'AlertCircle', 'RefreshCw', 'PenTool', 'ArrowRight', 'BookOpen', 'Volume2', 'Plus'];

icons.forEach(icon => {
  console.log(`${icon}: ${!!Lucide[icon]}`);
});
