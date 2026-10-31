import React from 'react';
import { AlertCircle, Clock, CheckCircle2 } from 'lucide-react';
import { calcularStatusVencimento, StatusVencimento } from '@/domain/services/task-service';
import { Badge } from '@/components/ui/Badge';

export interface UrgencyBadgeProps {
  dataEntrega: string;
  status: 'PENDENTE' | 'CONCLUIDA';
}

export const UrgencyBadge: React.FC<UrgencyBadgeProps> = ({ dataEntrega, status }) => {
  const statusVencimento: StatusVencimento = calcularStatusVencimento(dataEntrega, status);

  if (status === 'CONCLUIDA') {
    return (
      <Badge variant="success" size="sm">
        <CheckCircle2 className="w-3 h-3" />
        <span>Concluída</span>
      </Badge>
    );
  }

  switch (statusVencimento) {
    case 'VENCIDA':
      return (
        <Badge variant="danger" size="sm" className="font-semibold animate-pulse">
          <AlertCircle className="w-3 h-3" />
          <span>Atrasada</span>
        </Badge>
      );

    case 'URGENTE':
      return (
        <Badge variant="warning" size="sm" className="font-semibold">
          <Clock className="w-3 h-3 text-amber-700" />
          <span>Urgente (&lt;24h)</span>
        </Badge>
      );

    case 'NO_PRAZO':
    default:
      return (
        <Badge variant="default" size="sm">
          <Clock className="w-3 h-3 text-slate-500" />
          <span>No prazo</span>
        </Badge>
      );
  }
};
